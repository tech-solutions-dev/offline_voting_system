from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from accounts.models import User, Voter

class TokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.headers.get('Authorization')
        if not token:
            return None
        user = User.objects.filter(token=token).first()
        voter = Voter.objects.filter(token=token).first()
        if user:
            return (user, None)
        if voter:
            return (voter, None)
        raise AuthenticationFailed('Invalid token')