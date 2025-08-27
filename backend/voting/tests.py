from django.test import TestCase
from elections.models import Election, Portfolio, Candidate
from .models import Vote

class VoteModelTest(TestCase):
    def setUp(self):
        self.election = Election.objects.create(
            title='Test Election',
            start_time='2025-08-27T09:00:00Z',
            end_time='2025-08-27T17:00:00Z'
        )
        self.portfolio = Portfolio.objects.create(
            port_name='President',
            election=self.election
        )
        self.candidate = Candidate.objects.create(
            cand_fname='John Doe',
            portfolio=self.portfolio,
            election=self.election
        )

    def test_cast_vote_for_candidate(self):
        vote = Vote.objects.create(
            candidate=self.candidate,
            portfolio=self.portfolio,
            skip_vote=False,
            election=self.election
        )
        self.assertTrue(vote.has_voted)
        self.assertEqual(vote.candidate_name, 'John Doe')

    def test_cast_skip_vote(self):
        vote = Vote.objects.create(
            candidate=None,
            portfolio=self.portfolio,
            skip_vote=True,
            election=self.election
        )
        self.assertTrue(vote.has_voted)
        self.assertIsNone(vote.candidate_name)
