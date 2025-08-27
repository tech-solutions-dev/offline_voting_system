from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.utils import timezone
import secrets
import string
import hashlib



class Election(models.Model):
    title = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_active = models.BooleanField(default=False)
  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.start_time and self.end_time:
            if self.start_time >= self.end_time:
                raise ValidationError("Start time must be before end time")

    @property
    def is_ongoing(self):
        now = timezone.now()
        return self.start_time <= now <= self.end_time and self.is_active

    @property
    def has_started(self):
        return timezone.now() >= self.start_time

    @property
    def has_ended(self):
        return timezone.now() > self.end_time

    @property
    def time_remaining_minutes(self):
        if not self.is_ongoing:
            return 0
        return max(0, int((self.end_time - timezone.now()).total_seconds() / 60))

    def only_admin_allowed(self):
        """Return True if election has ended and only admin access is allowed."""
        return self.has_ended

    def __str__(self):
        return self.title


class Portfolio(models.Model):
    port_id = models.AutoField(primary_key=True)
    port_name = models.CharField(max_length=100)
    port_priority = models.IntegerField(default=1)
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    
    # Voting restrictions
    level_restriction = models.CharField(
        max_length=10,
        choices=[('100', 'Level 100'), ('200', 'Level 200'), ('300', 'Level 300'), ('400', 'Level 400')],
        blank=True, null=True
    )
    gender_restriction = models.CharField(
        max_length=10,
        choices=[('male', 'Male'), ('female', 'Female')],
        blank=True, null=True
    )
    department_restriction = models.CharField(
        max_length=100,
        blank=True, null=True
    )  # <-- Added department restriction field

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['port_priority']

    def can_voter_vote(self, voter):
        """Check if a voter is eligible to vote for this portfolio"""
        if self.level_restriction and voter.level != self.level_restriction:
            return False
        if self.gender_restriction and voter.gender != self.gender_restriction:
            return False
        if self.department_restriction and voter.department != self.department_restriction:
            return False
        return True

    def __str__(self):
        return self.port_name

class Candidate(models.Model):
    cand_id = models.AutoField(primary_key=True)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    cand_fname = models.CharField(max_length=100)
    profile_picture = models.ImageField(upload_to='candidates/', blank=True, null=True)
    ballot_num = models.IntegerField()
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['portfolio', 'ballot_num']
        ordering = ['ballot_num']

    def __str__(self):
        return f"{self.cand_fname} - {self.portfolio.port_name}"