from typing import List
from .models import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status
from rest_framework.response import Response
import rest_framework.serializers as rest_serializers
from rest_framework.decorators import action
from . import serializers

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

from drf_spectacular.utils import extend_schema, extend_schema_view

@extend_schema_view(
    list=extend_schema(description='Get a list of all users'),
    retrieve=extend_schema(description='Get details of a specific user'),
    create=extend_schema(description='Create a new user'),
    update=extend_schema(description='Update an existing user'),
    destroy=extend_schema(description='Delete an user')
)
class UserViewSet(viewsets.ModelViewSet):
    queryset : List = User.objects.all()
    serializer_class : rest_serializers.ModelSerializer = serializers.UserModelSerializer

    # Decide which endpoints need you to be authenticated
    def get_permissions(self):
        if self.action in ["auth", "update", "partial_update", "destroy"]:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_authentication_classes(self):
        if self.action in ["auth", "update", "partial_update", "destroy"]:
            return [TokenAuthentication]
        return []  # No authentication required for create
    
    def get_queryset(self):
        queryset = super().get_queryset()
        searchpattern = self.request.query_params.get('filter')
        if searchpattern: 
            queryset = queryset.filter(username__icontains=searchpattern)
        return queryset
    
    @extend_schema(
        description="User login endpoint",
        request=serializers.UserLoginSerializer,
        responses={201: serializers.UserModelSerializer},
    )
    @action(detail=False, methods=['post'])
    def login(self, request):
        """User sign in."""
        serializer = serializers.UserLoginSerializer(data=request.data)
        user_query: List = User.objects.filter(username=request.data["username"])
        if(user_query and not user_query[0].is_active):
           return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        
        serializer.is_valid(raise_exception=True)
        user, token = serializer.save()
        data = {
            'user': serializers.UserModelSerializer(user).data,
            'access_token': token
        }
        return Response(data, status=status.HTTP_200_OK)
    
    @extend_schema(
        description="Get the currently authenticated user",
        responses={200: serializers.UserModelSerializer}
    )
    @action(detail=False, methods=['get'])
    def auth(self, request):
        #only authed users can access this
        user: User = request.user
        data = serializers.UserModelSerializer(user).data
        return Response(data, status=status.HTTP_200_OK)
