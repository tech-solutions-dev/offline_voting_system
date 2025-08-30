from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from accounts.models import User, Voter

class TokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        token = auth_header.lower().split(' ')[1]
        print(token)
        # _,_,token = auth_header.partition(' ')
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