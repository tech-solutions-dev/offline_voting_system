#!/usr/bin/env python
"""
Script to create a superadmin user for the voting system.
Run this after setting up the database.
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evoting_system.settings')
django.setup()

from accounts.models import User

def create_superuser():
    email = input("Enter superadmin email: ")
    username = input("Enter superadmin username: ")
    password = input("Enter superadmin password: ")

    if User.objects.filter(email=email).exists():
        print(f"User with email {email} already exists!")
        return

    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        role=User.Role.SUPERADMIN
    )
    print(f"Superadmin user {email} created successfully!")

if __name__ == '__main__':
    create_superuser()
