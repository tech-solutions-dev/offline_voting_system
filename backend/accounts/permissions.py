from rest_framework import permissions
from .models import Voter
from elections.models import Election
from django.utils import timezone
                
class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'superadmin'

class IsAdminOrSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'superadmin']
class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsPollingAgent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'polling_agent'

class IsVoter(permissions.BasePermission):
    def has_permission(self, request, view):
        # This would be used for voter-specific endpoints
        return True  # Implement voter session logic here

class IsElectionActive(permissions.BasePermission):
    def has_permission(self, request, view):
    
        # Check if there's an active election
        election = Election.objects.filter(is_active=True).first()
        if not election:
            return False
        
        now = timezone.now()
        return election.start_time <= now <= election.end_time

class CanVote(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if voter is authenticated via token
        token = getattr(request.user, 'token', None)
        if not token:
            return False

        from voting.models import Voter, Vote, Portfolio

        try:
            voter = Voter.objects.get(token=token)
        except Voter.DoesNotExist:
            return False

        # Check if voter has already voted (anonymous voting: check Vote table for this election and voter)
        has_voted = Vote.objects.filter(voter=voter, election=voter.election).exists()
        if has_voted:
            return False

        # Check if election is ongoing
        if not voter.election.is_ongoing:
            return False

        # Check if voter is eligible to vote for this portfolio
        portfolio = request.data.get('portfolio')
        if not portfolio:
            return False
        # Level restriction
        if hasattr(portfolio, 'level_restriction') and portfolio.level_restriction:
            if voter.level != portfolio.level_restriction:
                return False

        # Gender restriction
        if hasattr(portfolio, 'gender_restriction') and portfolio.gender_restriction:
            if voter.gender != portfolio.gender_restriction:
                return False

        # Department restriction
        if hasattr(portfolio, 'department_restriction') and portfolio.department_restriction:
            if voter.department != portfolio.department_restriction:
                return False

        return True



class CanCreateAdminUsers(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'superadmin'

class CanCreatePollingAgents(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'




class CanUploadVoters(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class CanGenerateOTP(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'polling_agent'

class CanViewLogs(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


# User CRUD permissions
class CanViewUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['superadmin', 'admin']

class CanCreateUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'superadmin'

class CanUpdateUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin']

class CanDeleteUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'superadmin'

# Voter CRUD permissions
class CanViewVoter(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin']

class CanCreateVoter(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin']

class CanUpdateVoter(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin']

class CanDeleteVoter(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin']

