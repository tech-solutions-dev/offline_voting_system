from django.test import TestCase
from django.urls import reverse
from .models import User, Voter
from elections.models import Election

class UserModelTest(TestCase):
    def test_create_superadmin(self):
        user = User.objects.create_superuser(
            username='superadmin',
            email='superadmin@example.com',
            password='password',
            role=User.Role.SUPERADMIN
        )
        self.assertEqual(user.role, User.Role.SUPERADMIN)
        self.assertTrue(user.is_superuser)

class VoterModelTest(TestCase):
    def setUp(self):
        self.election = Election.objects.create(
            title='Test Election',
            start_time='2025-08-27T09:00:00Z',
            end_time='2025-08-27T17:00:00Z'
        )

    def test_create_voter(self):
        voter = Voter.objects.create(
            voter_id='VOTER001',
            password='pass',
            level='100',
            gender='male',
            department='Computer Science',
            election=self.election
        )
        self.assertEqual(voter.voter_id, 'VOTER001')
        self.assertEqual(voter.department, 'Computer Science')

    def test_generate_otp(self):
        voter = Voter.objects.create(
            voter_id='VOTER002',
            password='pass',
            level='200',
            gender='female',
            department='Mathematics',
            election=self.election
        )
        otp = voter.generate_otp()
        self.assertTrue(otp)
        self.assertNotEqual(voter.password, otp)  # password is hashed

class VoterViewSetTest(TestCase):
    def setUp(self):
        self.election = Election.objects.create(
            title='Test Election',
            start_time='2025-08-27T09:00:00Z',
            end_time='2025-08-27T17:00:00Z'
        )
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass',
            role='admin',
            election=self.election
        )

    def test_list_voters_requires_admin(self):
        self.client.force_login(self.admin)
        response = self.client.get(reverse('voter-list'))
        self.assertEqual(response.status_code, 200)

    def test_create_voter(self):
        self.client.force_login(self.admin)
        data = {
            "voter_id": "VOTER003",
            "level": "100",
            "gender": "male",
            "department": "Physics",
            "election": self.election.id
        }
        response = self.client.post(reverse('voter-list'), data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Voter.objects.filter(voter_id="VOTER003").exists())

    def test_update_not_allowed(self):
        self.client.force_login(self.admin)
        voter = Voter.objects.create(
            voter_id='VOTER004',
            password='pass',
            level='100',
            gender='male',
            department='Chemistry',
            election=self.election
        )
        url = reverse('voter-detail', args=[voter.voter_id])
        response = self.client.put(url, {"level": "200"})
        self.assertEqual(response.status_code, 405)

    def test_delete_not_allowed(self):
        self.client.force_login(self.admin)
        voter = Voter.objects.create(
            voter_id='VOTER005',
            password='pass',
            level='100',
            gender='male',
            department='Biology',
            election=self.election
        )
        url = reverse('voter-detail', args=[voter.voter_id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 405)
