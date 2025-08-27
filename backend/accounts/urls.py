from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, VoterViewSet,
    UserLoginView, VoterLoginView,
    UserLogoutView, VoterLogoutView,
    MeView, VoterGenerateOTPView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'voters', VoterViewSet, basename='voter')

urlpatterns = [
    path('auth/login/', UserLoginView.as_view(), name='user-login'),
    path('auth/voter_login/', VoterLoginView.as_view(), name='voter-login'),
    path('auth/logout/', UserLogoutView.as_view(), name='user-logout'),
    path('auth/voter_logout/', VoterLogoutView.as_view(), name='voter-logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('auth/generate-otp/<str:voter_id>/', VoterGenerateOTPView.as_view(), name='voter-generate-otp'),
    path('voters/upload-voters/', VoterViewSet.as_view({'post': 'upload_voters'}), name='voter-upload-voters'),
    path('', include(router.urls)),
]