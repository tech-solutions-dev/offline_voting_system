from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import  Vote
from elections.models import Election, Portfolio, Candidate
from accounts.models import Voter
from .serializers import VoteSerializer
from elections.serializers import PortfolioSerializer, CandidateSerializer
from  audit.utils import log_activity

class VotingViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]  # Handle voter permission in actions

    @action(detail=False, methods=['get'])
    def portfolios(self, request):
        """Get portfolios available for voting for a specific voter"""
        voter_id = request.query_params.get('voter_id')
        if not voter_id:
            return Response({'error': 'voter_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            voter = Voter.objects.get(voter_id=voter_id)
            portfolios = Portfolio.objects.filter(election=voter.election)
            eligible_portfolios = []
            for portfolio in portfolios:
                if portfolio.can_voter_vote(voter):
                    has_voted = Vote.objects.filter(portfolio=portfolio).exists()  # Anonymous: don't filter by voter
                    portfolio_data = PortfolioSerializer(portfolio).data
                    portfolio_data['has_voted'] = has_voted
                    portfolio_data['candidates'] = CandidateSerializer(
                        Candidate.objects.filter(portfolio=portfolio), many=True
                    ).data
                    eligible_portfolios.append(portfolio_data)
            return Response(eligible_portfolios)
        except Voter.DoesNotExist:
            return Response({'error': 'Voter not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def cast_vote(self, request):
        """
        Accepts a JSON payload with a list of votes:
        [
            {
                "voter_id": "VOTER123",
                "portfolio": <portfolio_id>,
                "candidate": <candidate_id or null>,
                "skip_vote": <true or false>
            },
            ...
        ]
        """
        votes_data = request.data if isinstance(request.data, list) else [request.data]
        results = []
        errors = []
        for data in votes_data:
            voter_id = data.get('voter_id')
            try:
                voter = Voter.objects.get(voter_id=voter_id)
            except Voter.DoesNotExist:
                errors.append({'error': f'Voter {voter_id} not found'})
                continue
            if not voter.election.is_ongoing:
                errors.append({'error': f'Election is not currently active for voter {voter_id}'})
                continue
            serializer = VoteSerializer(data=data)
            if serializer.is_valid():
                vote = serializer.save(election=voter.election)
                log_activity(request, 'cast_vote', f'Vote cast for {vote.portfolio.port_name}', voter=voter)
                results.append(VoteSerializer(vote).data)
            else:
                errors.append(serializer.errors)
        if errors:
            return Response({'errors': errors, 'results': results}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'results': results}, status=status.HTTP_201_CREATED)

class VoteTimeAPIView(APIView):
    """
    Returns the current server time and election time info.
    """
    def get(self, request, *args, **kwargs):
        election_id = request.query_params.get('election')
        if not election_id:
            return Response({'error': 'election id required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            election = Election.objects.get(pk=election_id)
        except Election.DoesNotExist:
            return Response({'error': 'Election not found'}, status=status.HTTP_404_NOT_FOUND)
        now = timezone.now()
        time_remaining = max(0, int((election.end_time - now).total_seconds() // 60))
        return Response({
            'server_time': now,
            'election_start': election.start_time,
            'election_end': election.end_time,
            'time_remaining_minutes': time_remaining
        })
