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
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('voter_login/', VoterLoginView.as_view(), name='voter-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('voter_logout/', VoterLogoutView.as_view(), name='voter-logout'),
    path('me/', MeView.as_view(), name='me'),
    path('generate-otp/<str:voter_id>/', VoterGenerateOTPView.as_view(), name='voter-generate-otp'),
    path('voters/upload-voters/', VoterViewSet.as_view({'post': 'upload_voters'}), name='voter-upload-voters'),
    path('', include(router.urls)),
]