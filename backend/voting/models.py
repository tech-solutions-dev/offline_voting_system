from django.db import models
from django.core.exceptions import ValidationError
from elections.models import Candidate, Portfolio, Election

class Vote(models.Model):
    vote_id = models.AutoField(primary_key=True)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, null=True, blank=True)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    skip_vote = models.BooleanField(default=False)
    vote_time = models.DateTimeField(auto_now_add=True)
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    # No voter field for anonymity

    class Meta:
        unique_together = ['portfolio', 'candidate', 'election', 'vote_time']  # Remove voter

    def clean(self):
        if not self.skip_vote and not self.candidate:
            raise ValidationError("Must select a candidate or mark as skip vote")
        if self.skip_vote and self.candidate:
            raise ValidationError("Cannot select candidate and skip vote")

    def __str__(self):
        if self.skip_vote:
            return f"Skipped vote - {self.portfolio.port_name}"
        return f"Vote for {self.candidate.cand_fname} - {self.portfolio.port_name}"

    @property
    def candidate_name(self):
        return self.candidate.cand_fname if self.candidate else None

    @property
    def portfolio_name(self):
        return self.portfolio.port_name if self.portfolio else None

    @property
    def election_title(self):
        return self.election.title if self.election else None

    @property
    def has_voted(self):
        """
        Returns True if this vote instance represents a valid vote (either for a candidate or skipped).
        """
        return (self.candidate is not None and not self.skip_vote) or self.skip_vote

