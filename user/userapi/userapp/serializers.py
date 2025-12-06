from .models import User, Campus
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

class UserModelSerializer(serializers.ModelSerializer):

    password = serializers.CharField(min_length=8, max_length=64, write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'name', 'weixinId', 'email', 'phone_number', 'campus', 'preferedLanguage']
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)   # hash the password
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)  # hash new password
        instance.save()
        return instance
        
class UserLoginSerializer(serializers.Serializer):

    # Required fields
    username = serializers.CharField(min_length=3, max_length=64, required=True, error_messages={
        'required': 'The username field is required.',
        'blank': 'The username field cannot be blank.',
        'min_length': 'Username must be at least 3 characters long.',
        'max_length': 'Username must not exceed 64 characters.'
    })
    password = serializers.CharField(min_length=8, max_length=64, write_only=True, required=True, error_messages={
        'required': 'The password field is required.',
        'blank': 'The password field cannot be blank.',
        'min_length': 'Password must be at least 8 characters long.',
        'max_length': 'Password must not exceed 64 characters.'
    })

    # Verify the data
    def validate(self, data):
        
        # authenticate recieves the credentials, if valid returns the user object
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError('The provided credentials are invalid.')

        # We save the user in the context to later retrieve the token
        self.context['user'] = user
        return data

    def create(self, data):
        """Generate or retrieve token"""
        token, created = Token.objects.get_or_create(user=self.context['user'])
        return self.context['user'], token.key

class CampusModelSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Campus
        fields = '__all__'