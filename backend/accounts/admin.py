from django.contrib import admin
from .models import User, Voter


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
  list_display = ('username', 'email', 'role', 'is_staff', 'is_superuser', 'election', 'created_at')
  list_filter = ('role', 'is_staff', 'is_superuser')
  search_fields = ('username', 'email')


@admin.register(Voter)
class VoterAdmin(admin.ModelAdmin):
  list_display = ('voter_id', 'election', 'level', 'gender', 'department', 'has_voted', 'created_at')
  list_filter = ('level', 'gender', 'has_voted')
  search_fields = ('voter_id', 'department')