from django.contrib import admin
from .models import Election, Portfolio, Candidate


@admin.register(Election)
class ElectionAdmin(admin.ModelAdmin):
  list_display = ('id', 'title', 'start_time', 'end_time', 'is_active', 'created_at')
  list_filter = ('is_active',)
  search_fields = ('title',)


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
  list_display = ('port_id', 'port_name', 'port_priority', 'election', 'level_restriction', 'gender_restriction')
  list_filter = ('election', 'level_restriction', 'gender_restriction')
  search_fields = ('port_name',)


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
  list_display = ('cand_id', 'cand_fname', 'portfolio', 'ballot_num', 'election')
  list_filter = ('portfolio', 'election')
  search_fields = ('cand_fname',)