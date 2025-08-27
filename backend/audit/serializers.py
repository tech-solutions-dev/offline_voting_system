from rest_framework import serializers
from .models import Log

class LogSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    voter_id = serializers.SerializerMethodField()

    class Meta:
        model = Log
        fields = [
            'log_id', 'user', 'user_email', 'voter', 'voter_id',
            'log_action', 'ip_address', 'description', 'log_time'
        ]

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None

    def get_voter_id(self, obj):
        return obj.voter

