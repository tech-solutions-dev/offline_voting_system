from rest_framework import serializers
from .models import User, Voter
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id',  'email', 'role', 'election', 'password', 'created_at', 'updated_at', 'token'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class VoterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voter
        fields = [
            'voter_id', 'level', 'gender', 'department', 'election', 'has_voted', 'created_at', 'updated_at', 'token'
        ]
        read_only_fields = ['has_voted', 'created_at', 'updated_at', 'token']
        

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            token = user.generate_token()
            data['user'] = user
            data['token'] = token
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return data

class VoterLoginSerializer(serializers.Serializer):
    voter_id = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        voter_id = data.get('voter_id')
        password = data.get('password')

        try:
            voter = Voter.objects.get(voter_id=voter_id)
        except Voter.DoesNotExist:
            raise serializers.ValidationError('Invalid voter ID')

        if voter.password != password:
            raise serializers.ValidationError('Invalid password')

        token = voter.generate_token()
        data['voter'] = voter
        data['token'] = token
        
        return data

