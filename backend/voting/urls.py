from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VotingViewSet, VoteTimeAPIView

router = DefaultRouter()
router.register(r'voting', VotingViewSet, basename='voting')

urlpatterns = [
    path('', include(router.urls)),
    path('vote-time/', VoteTimeAPIView.as_view(), name='vote-time'),
]
