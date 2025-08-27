from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ElectionViewSet, PortfolioViewSet, CandidateViewSet

router = DefaultRouter()
router.register(r'elections', ElectionViewSet, basename='election')
router.register(r'portfolios', PortfolioViewSet, basename='portfolio')
router.register(r'candidates', CandidateViewSet, basename='candidate')

urlpatterns = [
    path('', include(router.urls)),
]
