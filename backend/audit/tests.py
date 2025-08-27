from django.test import TestCase
from .models import Log
from accounts.models import User
from elections.models import Election

class LogModelTest(TestCase):
    def setUp(self):
        self.election = Election.objects.create(
            title='Test Election',
            start_time='2025-08-27T09:00:00Z',
            end_time='2025-08-27T17:00:00Z'
        )
        self.user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='pass',
            role='admin',
            election=self.election
        )

    def test_log_creation(self):
        log = Log.objects.create(
            user=self.user,
            log_action='login',
            ip_address='127.0.0.1',
            description='User logged in'
        )
        self.assertEqual(log.user, self.user)
        self.assertEqual(log.log_action, 'login')
