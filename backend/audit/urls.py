from django.urls import path, include
from .views import LogViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'logs', LogViewSet, basename='log')

urlpatterns = [
    path('', include(router.urls)),
]

