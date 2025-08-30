from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from accounts.models import User, Voter

class TokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise AuthenticationFailed("Invalid Authorization header format. Expected 'Bearer <token>'")

        token = parts[1]

        if not token:
            raise AuthenticationFailed("Token missing")

        # ✅ Lookup user or voter
        user = User.objects.filter(token=token).first()
        if user:
            return (user, None)

        voter = Voter.objects.filter(token=token).first()
        if voter:
            return (voter, None)

        raise AuthenticationFailed("Invalid token")
