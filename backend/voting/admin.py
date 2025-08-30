from django.contrib import admin
from .models import Vote


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
  list_display = ('vote_id', 'candidate_name', 'portfolio_name', 'election', 'skip_vote', 'vote_time')
  list_filter = ('skip_vote', 'election', 'portfolio')
  search_fields = ('candidate__cand_fname', 'portfolio__port_name')