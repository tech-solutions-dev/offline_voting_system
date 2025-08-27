from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from .models import Election, Portfolio, Candidate
from voting.models import Vote
from audit.models import Log
from accounts.models import User, Voter
from .serializers import ElectionSerializer, PortfolioSerializer, CandidateSerializer
from accounts.serializers import UserSerializer, VoterSerializer,  LoginSerializer, VoterLoginSerializer
from audit.serializers import LogSerializer
from accounts.permissions import (
  IsSuperAdmin, IsAdminOrSuperAdmin, IsAdmin,
)
from .permissions import (
    CanCheckElectionRemainingTime,   CanViewElection, CanCreateElection, CanUpdateElection, CanDeleteElection, 
    CanViewPortfolio, CanCreatePortfolio, CanUpdatePortfolio, CanDeletePortfolio,
    CanViewCandidate, CanCreateCandidate, CanUpdateCandidate, CanDeleteCandidate
)
from audit.utils import log_activity

class ElectionViewSet(viewsets.ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer

    def get_permissions(self):
        action = self.action
        if action in ['list', 'retrieve']:
            permission_classes = [CanViewElection]
        elif action == 'create':
            permission_classes = [CanCreateElection]
        elif action in ['update', 'partial_update']:
            permission_classes = [CanUpdateElection]
        elif action == 'destroy':
            permission_classes = [CanDeleteElection]
        elif action == 'remaining_time':
            permission_classes = [CanCheckElectionRemainingTime]
        else:
            permission_classes = [IsSuperAdmin]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'])
    def adjust_time(self, request, pk=None):
        election = self.get_object()
        new_end_time = request.data.get('end_time')
        if new_end_time:
            election.end_time = new_end_time
            election.save()
            if self.get_remaining_minutes(election) < 30:
                return Response({
                    'message': 'Election time adjusted',
                    'warning': 'Less than 30 minutes remaining - ECS should be alerted'
                })
            log_activity(request, 'update', f'Adjusted election time for {election.title}')
            return Response({'message': 'Election time adjusted successfully'})
        return Response({'error': 'end_time is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        election = self.get_object()
        portfolios = Portfolio.objects.filter(election=election)
        results = []
        for portfolio in portfolios:
            candidates_data = []
            candidates = Candidate.objects.filter(portfolio=portfolio)
            for candidate in candidates:
                vote_count = Vote.objects.filter(candidate=candidate).count()
                candidates_data.append({
                    'id': candidate.cand_id,
                    'name': candidate.cand_fname,
                    'ballot_num': candidate.ballot_num,
                    'votes': vote_count,
                    'percentage': (vote_count / max(1, Vote.objects.filter(portfolio=portfolio).count())) * 100
                })
            total_votes = Vote.objects.filter(portfolio=portfolio).count()
            skipped_votes = Vote.objects.filter(portfolio=portfolio, skip_vote=True).count()
            results.append({
                'portfolio_id': portfolio.port_id,
                'portfolio_name': portfolio.port_name,
                'total_votes': total_votes,
                'skipped_votes': skipped_votes,
                'candidates': candidates_data
            })
        return Response(results)

    @action(detail=True, methods=['get'])
    def remaining_time(self, request, pk=None):
        election = self.get_object()
        minutes = self.get_remaining_minutes(election)
        return Response({'remaining_minutes': minutes})

    def get_remaining_minutes(self, election):
        now = timezone.now()
        if election.end_time > now:
            delta = election.end_time - now
            return int(delta.total_seconds() // 60)
        return 0


class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer

    def get_permissions(self):
        if self.request:
            permission_classes = [IsAdmin]
        action = self.action
        if action in ['list', 'retrieve']:
            permission_classes = [CanViewPortfolio]
        elif action == 'create':
            permission_classes = [CanCreatePortfolio]
        elif action in ['update', 'update_level', 'update_gender', 'update_department']:
            permission_classes = [CanUpdatePortfolio]
        elif action == 'destroy':
            permission_classes = [CanDeletePortfolio]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Portfolio.objects.filter(election=self.request.user.election)

    def perform_create(self, serializer):
        # Validation is handled by PortfolioSerializer.validate
        instance = serializer.save(election=self.request.user.election)

    @action(detail=True, methods=['patch'])
    def update_level(self, request, pk=None):
        portfolio = self.get_object()
        level = request.data.get('level_restriction')
        serializer = self.get_serializer(portfolio, data={'level_restriction': level}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        log_activity(request, 'update', f'Updated level restriction for portfolio {portfolio.port_name}')
        return Response({'message': 'Level restriction updated successfully'})

    @action(detail=True, methods=['patch'])
    def update_gender(self, request, pk=None):
        portfolio = self.get_object()
        gender = request.data.get('gender_restriction')
        serializer = self.get_serializer(portfolio, data={'gender_restriction': gender}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        log_activity(request, 'update', f'Updated gender restriction for portfolio {portfolio.port_name}')
        return Response({'message': 'Gender restriction updated successfully'})

    @action(detail=True, methods=['patch'])
    def update_department(self, request, pk=None):
        portfolio = self.get_object()
        department = request.data.get('department_restriction')
        serializer = self.get_serializer(portfolio, data={'department_restriction': department}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        log_activity(request, 'update', f'Updated department restriction for portfolio {portfolio.port_name}')
        return Response({'message': 'Department restriction updated successfully'})


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    parser_classes = [MultiPartParser, FormParser]  # For profile picture uploads

    def get_permissions(self):
        action = self.action
        if action in ['list', 'retrieve']:
            permission_classes = [CanViewCandidate]
        elif action == 'create':
            permission_classes = [CanCreateCandidate]
        elif action in ['update', 'update_portfolio', 'update_ballot_num', 'update_profile_picture']:
            permission_classes = [CanUpdateCandidate]
        elif action == 'destroy':
            permission_classes = [CanDeleteCandidate]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Candidate.objects.filter(election=self.request.user.election)

    def perform_create(self, serializer):
        instance = serializer.save(election=self.request.user.election)
        log_activity(self.request, 'create', f'Created candidate {instance.cand_fname}')

    def perform_update(self, serializer):
        instance = serializer.save()
        log_activity(self.request, 'update', f'Updated candidate {instance.cand_fname}')

    def perform_destroy(self, instance):
        log_activity(self.request, 'delete', f'Deleted candidate {instance.cand_fname}')
        instance.delete()

    @action(detail=True, methods=['patch'])
    def update_ballot_num(self, request, pk=None):
        candidate = self.get_object()
        ballot_num = request.data.get('ballot_num')
        if ballot_num is not None:
            candidate.ballot_num = ballot_num
            candidate.save()
            log_activity(request, 'update', f'Updated ballot number for candidate {candidate.cand_fname}')
            return Response({'message': 'Ballot number updated successfully'})
        return Response({'error': 'No ballot_num provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def update_profile_picture(self, request, pk=None):
        candidate = self.get_object()
        profile_picture = request.FILES.get('profile_picture')
        if profile_picture is not None:
            candidate.profile_picture = profile_picture
            candidate.save()
            log_activity(request, 'update', f'Updated profile picture for candidate {candidate.cand_fname}')
            return Response({'message': 'Profile picture updated successfully'})
        return Response({'error': 'No profile_picture provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def update_portfolio(self, request, pk=None):
        candidate = self.get_object()
        portfolio_id = request.data.get('portfolio')
        if portfolio_id is not None:
            try:
                new_portfolio = Portfolio.objects.get(pk=portfolio_id, election=self.request.user.election)
            except Portfolio.DoesNotExist:
                return Response({'error': 'Portfolio not found or not in your election'}, status=status.HTTP_404_NOT_FOUND)
            candidate.portfolio = new_portfolio
            candidate.save()
            log_activity(request, 'update', f'Updated portfolio for candidate {candidate.cand_fname}')
            return Response({'message': 'Portfolio updated successfully'})
        return Response({'error': 'No portfolio provided'}, status=status.HTTP_400_BAD_REQUEST)
