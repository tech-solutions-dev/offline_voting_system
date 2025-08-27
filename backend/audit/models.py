from django.db import models


class Log(models.Model):
    class Action(models.TextChoices):
        CAST_VOTE = 'cast_vote', 'Cast Vote'
        LOGIN = 'login', 'Login'
        GENERATE_TOKEN = 'generate_token', 'Generate Token'
        UPDATE = 'update', 'Update'
        DELETE = 'delete', 'Delete'

    log_id = models.AutoField(primary_key=True)
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, null=True, blank=True)
    voter = models.ForeignKey("accounts.Voter", on_delete=models.CASCADE, null=True, blank=True)
    log_action = models.CharField(max_length=20, choices=Action.choices)
    ip_address = models.GenericIPAddressField()
    description = models.TextField(blank=True)
    log_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-log_time']

    def __str__(self):
        actor = self.user.email if self.user else self.voter.voter_id if self.voter else 'Unknown'
        return f"{actor} - {self.log_action} at {self.log_time}"
