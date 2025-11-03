from .models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'wechat_id', 'campus']
    
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
    username = serializers.CharField(min_length=3, max_length=64)
    password = serializers.CharField(min_length=8, max_length=64, write_only=True)

    # Verify the data
    def validate(self, data):
        
        # authenticate recieves the credentials, if valid returns the user object
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError('The credentials are invalid')

        # We save the user in the context to later retrieve the token
        self.context['user'] = user
        return data

    def create(self, data):
        """Generate or retrieve token"""
        token, created = Token.objects.get_or_create(user=self.context['user'])
        return self.context['user'], token.key