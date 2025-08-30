from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import secrets
import string
import hashlib

from elections.models import Election
class CustomUserManager(BaseUserManager):
    """
    Custom user manager for the CustomUser model.
    """
    def create_user(self, username=None, email=None, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            username = email
        email = self.normalize_email(email)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username=None, email=None, password=None, **extra_fields):
        """
        Create and return a superuser with an email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if not username:
            username = email
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    class Role(models.TextChoices):
        SUPERADMIN = 'superadmin', 'Super Admin'
        ADMIN = 'admin', 'Admin'
        POLLING_AGENT = 'polling_agent', 'Polling Agent'

    role = models.CharField(max_length=20, choices=Role.choices)
    email = models.EmailField(unique=True)
    election = models.ForeignKey('elections.Election', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    token = models.CharField(max_length=40, blank=True, null=True, unique=True)

    # Use the custom manager
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

   
    def generate_token(self):
        import secrets
        self.token = secrets.token_hex(20)
        self.save()
        return self.token

    def save(self, *args, **kwargs):
        # Set role based on superuser status for backward compatibility
        if self.is_superuser and self.role != self.Role.SUPERADMIN:
            self.role = self.Role.SUPERADMIN
        elif self.is_staff and self.role not in [self.Role.ADMIN, self.Role.SUPERADMIN]:
            self.role = self.Role.ADMIN
        
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.username} ({self.role})"
    


class Voter(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    LEVEL_CHOICES = [
        ('100', 'Level 100'),
        ('200', 'Level 200'),
        ('300', 'Level 300'),
        ('400', 'Level 400'),
    ]

    voter_id = models.CharField(max_length=50, unique=True, primary_key=True)
    password = models.CharField(max_length=128, blank=True)  # OTP will be stored here
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    department = models.CharField(max_length=100)  # Added department field
    election = models.ForeignKey("elections.Election", on_delete=models.CASCADE)
    has_voted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    token = models.CharField(max_length=40, blank=True, null=True, unique=True)

    def generate_otp(self):
        """Generate a 6-character OTP, hash it, and store the hash in password"""
        chars = string.ascii_letters + string.digits
        otp = ''.join(secrets.choice(chars) for _ in range(6))
        hashed_otp = hashlib.sha256(otp.encode()).hexdigest()
        self.password = hashed_otp
        self.save()
        return otp  # Return the raw OTP for sending to the voter

    def generate_token(self):
        import secrets
        self.token = secrets.token_hex(20)
        self.save()
        return self.token

    def __str__(self):
        return f"{self.voter_id} - Level {self.level}"


