from django.shortcuts import render
from rest_framework import viewsets
from accounts.permissions import CanViewLogs, IsAdminOrSuperAdmin
from .serializers import LogSerializer
from .models import Log

# Create your views here.
class LogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    permission_classes = [IsAdminOrSuperAdmin, CanViewLogs]

    def get_queryset(self):
        return Log.objects.all()