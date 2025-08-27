from django.test import TestCase
from .models import Election, Portfolio, Candidate

class ElectionModelTest(TestCase):
    def test_election_creation(self):
        election = Election.objects.create(title='Test Election', start_time='2025-08-27T09:00:00Z', end_time='2025-08-27T17:00:00Z')
        self.assertEqual(election.title, 'Test Election')

class PortfolioModelTest(TestCase):
    def test_portfolio_creation(self):
        election = Election.objects.create(title='Test Election', start_time='2025-08-27T09:00:00Z', end_time='2025-08-27T17:00:00Z')
        portfolio = Portfolio.objects.create(port_name='President', election=election)
        self.assertEqual(portfolio.port_name, 'President')

class CandidateModelTest(TestCase):
    def test_candidate_creation(self):
        election = Election.objects.create(title='Test Election', start_time='2025-08-27T09:00:00Z', end_time='2025-08-27T17:00:00Z')
        portfolio = Portfolio.objects.create(port_name='President', election=election)
        candidate = Candidate.objects.create(cand_fname='John Doe', portfolio=portfolio, election=election)
        self.assertEqual(candidate.cand_fname, 'John Doe')
