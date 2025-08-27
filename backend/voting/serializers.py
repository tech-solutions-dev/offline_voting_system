from rest_framework import serializers
from .models import Vote

class VoteSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source='candidate.cand_fname', read_only=True)
    portfolio_name = serializers.CharField(source='portfolio.port_name', read_only=True)
    election_title = serializers.CharField(source='election.title', read_only=True)
    has_voted = serializers.ReadOnlyField()

    class Meta:
        model = Vote
        fields = [
            'vote_id', 'candidate', 'candidate_name', 'portfolio', 'portfolio_name',
            'skip_vote', 'vote_time', 'election', 'election_title', 'has_voted'
        ]

    def validate(self, data):
        # Validate skip vote logic
        if data.get('skip_vote') and data.get('candidate'):
            raise serializers.ValidationError("Cannot select candidate and skip vote")
        if not data.get('skip_vote') and not data.get('candidate'):
            raise serializers.ValidationError("Must select a candidate or mark as skip vote")
        return data  # <-- This is required!
