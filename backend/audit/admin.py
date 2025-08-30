from django.contrib import admin
from .models import Log


@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
  list_display = ('log_id', 'user', 'voter', 'log_action', 'ip_address', 'log_time')
  list_filter = ('log_action', 'log_time')
  search_fields = ('user__email', 'voter__voter_id', 'description')