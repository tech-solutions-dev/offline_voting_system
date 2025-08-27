from rest_framework import serializers
from .models import Election, Portfolio, Candidate

class ElectionSerializer(serializers.ModelSerializer):
    is_ongoing = serializers.ReadOnlyField()
    has_started = serializers.ReadOnlyField()
    has_ended = serializers.ReadOnlyField()
    time_remaining_minutes = serializers.ReadOnlyField()

    class Meta:
        model = Election
        fields = [
            'id', 'title', 'start_time', 'end_time', 'is_active',
            'created_at', 'updated_at',
            'is_ongoing', 'has_started', 'has_ended', 'time_remaining_minutes'
        ]

class PortfolioSerializer(serializers.ModelSerializer):
    election_title = serializers.CharField(source='election.title', read_only=True)

    class Meta:
        model = Portfolio
        fields = [
            'port_id', 'port_name', 'port_priority', 'election', 'election_title',
            'level_restriction', 'gender_restriction', 'department_restriction',
            'created_at', 'updated_at'
        ]

    def validate(self, data):
        # Validate level_restriction
        level_choices = ['100', '200', '300', '400']
        if data.get('level_restriction') and data['level_restriction'] not in level_choices:
            raise serializers.ValidationError({'level_restriction': 'Invalid level restriction.'})

        # Validate gender_restriction
        gender_choices = ['male', 'female']
        if data.get('gender_restriction') and data['gender_restriction'] not in gender_choices:
            raise serializers.ValidationError({'gender_restriction': 'Invalid gender restriction.'})

        # Validate department_restriction (optional: you can add your own department list)
        if data.get('department_restriction') and not isinstance(data['department_restriction'], str):
            raise serializers.ValidationError({'department_restriction': 'Department must be a string.'})

        return data

class CandidateSerializer(serializers.ModelSerializer):
    portfolio_name = serializers.CharField(source='portfolio.port_name', read_only=True)
    election_title = serializers.CharField(source='election.title', read_only=True)

    class Meta:
        model = Candidate
        fields = [
                'cand_id', 'portfolio', 'portfolio_name', 'cand_fname',
                'profile_picture', 'ballot_num', 'election', 'election_title',
                'created_at',
            ]

