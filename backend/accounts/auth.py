from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from accounts.models import User, Voter

class TokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not isinstance(auth_header, str):
            return None
        parts = auth_header.strip().split()
        if len(parts) != 2 or  parts[0].lower() != 'token':
            return None
        print(parts)
        token = parts[1]  
        print(token)
        if not token:
            return None
        user = User.objects.filter(token=token).first()
        voter = Voter.objects.filter(token=token).first()
        if user:
            return (user, None)
        if voter:
            return (voter, None)
        raise AuthenticationFailed('Invalid token')