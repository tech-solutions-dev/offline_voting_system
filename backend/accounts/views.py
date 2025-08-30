from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, logout
from .models import User, Voter
from .serializers import LoginSerializer, UserSerializer, VoterSerializer, VoterLoginSerializer
from .permissions import (
    IsSuperAdmin, IsAdmin, IsPollingAgent, IsAdminOrSuperAdmin,
    CanUploadVoters, CanGenerateOTP, CanViewLogs,
    CanViewUser, CanCreateUser, CanUpdateUser, CanDeleteUser,
    CanViewVoter, CanCreateVoter, CanUpdateVoter, CanDeleteVoter, CanCreatePollingAgents, CanCreateAdminUsers
)
from audit.utils import log_activity
from voting.models import Vote
from rest_framework.views import APIView
import openpyxl
from rest_framework.decorators import action

# --- Generic Views ---

class UserLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token = serializer.validated_data['token']

            # Election and permission checks
            if user.role != 'superadmin':
                if not user.election:
                    return Response({'error': 'No election assigned'}, status=status.HTTP_400_BAD_REQUEST)
                # Only admin can login if election has ended
                if user.election.only_admin_allowed() and user.role != 'admin':
                    return Response({'error': 'Election has ended. Only admin can login and view results.'}, status=status.HTTP_403_FORBIDDEN)
                if user.role == 'polling_agent' and not user.election.has_started:
                    return Response({'error': 'Election has not started yet'}, status=status.HTTP_400_BAD_REQUEST)
            log_activity(request, 'login', f'User {user.email} logged in', user=user)
            return Response({'user': {'token': token, 'role': user.role, 'email': user.email}, 'message': 'Login successful'})
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class VoterLoginView(generics.GenericAPIView):
    serializer_class = VoterLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = VoterLoginSerializer(data=request.data)
        if serializer.is_valid():
            voter = serializer.validated_data['voter']
            token = serializer.validated_data['token']

            # Check if election is ongoing
        # Check if election is ongoing
        if not voter.election.is_ongoing:
            return Response({'error': 'Election is not currently active'}, status=status.HTTP_400_BAD_REQUEST)
        if voter.election.only_admin_allowed():
            return Response({'error': 'Only admin can login'}, status=status.HTTP_403_FORBIDDEN)
        # Check if voter has already voted
        has_voted = Vote.objects.filter(voter=voter, election=voter.election).exists()
        if has_voted:
            return Response({'error': 'You have already voted'}, status=status.HTTP_400_BAD_REQUEST)
        
        log_activity(request, 'login', f'Voter {voter.voter_id} logged in', voter=voter)
        return Response({
                'voter': {
                    'token': token,
                    'voter_id': voter.voter_id,
                    'level': voter.level,
                    'gender': voter.gender
                },
                'message': 'Login successful'
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class VoterGenerateOTPView(generics.GenericAPIView):
    serializer_class = VoterSerializer
    permission_classes = [IsAuthenticated, IsPollingAgent, CanGenerateOTP]

    def post(self, request, voter_id, *args, **kwargs):
        try:
            voter = Voter.objects.get(voter_id=voter_id)
        except Voter.DoesNotExist:
            return Response({'error': 'Voter not found'}, status=status.HTTP_404_NOT_FOUND)
        otp = voter.generate_otp()
        log_activity(request, 'generate_otp', f'Generated OTP for voter {voter.voter_id}', voter=voter)
        return Response({'otp': otp, 'voter_id': voter.voter_id})

# --- ViewSets ---

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        action = self.action
        role = getattr(self.request.user, 'role', None)
        requested_role = self.request.data.get('role')

        if action in ['list', 'retrieve']:
            permission_classes = [CanViewUser]
        elif action == 'create':
            if requested_role == 'admin':
                permission_classes = [CanCreateAdminUsers]
            elif requested_role == 'polling_agent':
                permission_classes = [CanCreatePollingAgents]
            else:
                permission_classes = []
        elif action in ['update', 'partial_update']:
            permission_classes = [CanUpdateUser]
        elif action == 'destroy':
            permission_classes = [CanDeleteUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        role = getattr(self.request.user, 'role', None)
        if role == 'superadmin':
            return User.objects.filter(role__in=['admin', 'polling_agent'])
        elif role == 'admin':
            return User.objects.filter(role='polling_agent', election=self.request.user.election)
        else:
            return User.objects.none()

    def perform_update(self, serializer):
        instance = serializer.save()
        log_activity(self.request, 'update', f'Updated user {instance.pk}', user=instance)

    def perform_destroy(self, instance):
        log_activity(self.request, 'delete', f'Deleted user {instance.pk}', user=instance)
        instance.delete()

class VoterViewSet(viewsets.ModelViewSet):
    queryset = Voter.objects.all()
    serializer_class = VoterSerializer

    def get_permissions(self):
        action = self.action
        if action in ['list', 'retrieve']:
            permission_classes = [CanViewVoter]
        elif action == 'create':
            permission_classes = [CanCreateVoter]
        elif action == 'upload_voters':
            permission_classes = [CanUploadVoters]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        role = self.request.user.role if self.request.user.is_authenticated else None
        if role == 'admin':
            return Voter.objects.filter(election=self.request.user.election)
        else:
            return Voter.objects.none()

    def perform_create(self, serializer):
        instance = serializer.save(election=self.request.user.election)
    

    @action(detail=False, methods=['post'], url_path='upload-voters')
    def upload_voters(self, request):
        """
        Upload an Excel file containing a list of voters.
        Expected columns: voter_id, password, level, gender, department
        """
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            wb = openpyxl.load_workbook(file)
            ws = wb.active
        except Exception as e:
            return Response({'error': f'Invalid Excel file: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        created_voters = []
        errors = []
        # Expecting columns: voter_id, password, level, gender, department
        for idx, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
            voter_id, password, level, gender, department = row
            if not voter_id or not password or not department:
                errors.append(f"Row {idx}: Missing voter_id, password, or department")
                continue
            if Voter.objects.filter(voter_id=voter_id).exists():
                errors.append(f"Row {idx}: Voter {voter_id} already exists")
                continue
            voter = Voter.objects.create(
                voter_id=voter_id,
                password=password,
                level=level,
                gender=gender,
                department=department,
                election=self.request.user.election
            )
            created_voters.append(voter.voter_id)

        return Response({
            'message': 'Voters uploaded successfully',
            'created_voters': created_voters,
            'errors': errors
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        return Response({'error': 'Update not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, *args, **kwargs):
        return Response({'error': 'Partial update not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response({'error': 'Delete not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class UserLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            user.token = None
            user.save()
           
            logout(request)
            log_activity(request, 'logout', f'User {user.email} logged out', user=user)
            return Response({'message': 'Logout successful'})
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class VoterLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        voter = getattr(request, 'user', None)
        if voter and hasattr(voter, 'voter_id'):
            voter.token = None
            voter.save()
           
            logout(request)
            log_activity(request, 'logout', f'Voter {voter.voter_id} logged out', voter=voter)
            return Response({'message': 'Logout successful'})
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if hasattr(user, 'voter_id'):
            return Response(VoterSerializer(user).data)
        return Response(UserSerializer(user).data)

