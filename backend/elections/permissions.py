from rest_framework import permissions
from accounts.models import Voter
from elections.models import Election
from django.utils import timezone
                

# Election CRUD permissions
class CanViewElection(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['superadmin', 'admin']

class CanCreateElection(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'superadmin'

class CanUpdateElection(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'superadmin'

class CanDeleteElection(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'superadmin'

# Portfolio CRUD permissions
class CanViewPortfolio(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class CanCreatePortfolio(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class CanUpdatePortfolio(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class CanDeletePortfolio(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

# Candidate CRUD permissions
class CanViewCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role =='admin'

class CanCreateCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class CanUpdateCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class CanDeleteCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

# Permission to check if election has remaining time
class CanCheckElectionRemainingTime(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role not in ['superadmin', 'admin']:
            return False
        election_id = view.kwargs.get('pk') or request.data.get('election_id')
        if not election_id:
            return False
        try:
            election = Election.objects.get(pk=election_id)
        except Election.DoesNotExist:
            return False
        return True