from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import check_password, make_password
class UserSerializer(serializers.Serializer):

    class Meta:
        model = User
        fields = '__all__'
    
class RegistrationSerializer(serializers.ModelSerializer):
    """Serializers registration requests and creates a new user."""
    class Meta:
        model = User
        fields = ['email', 'first_name','last_name', 'password','access','refresh','is_staff', 'user_status']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        if 'is_staff' in validated_data:
            if validated_data['is_staff'] == True:
                return User.objects.create(email=validated_data["email"],password=validated_data["password"],first_name=validated_data["first_name"],last_name=validated_data["last_name"], is_admin=True, enrollment="", is_active=True)
            else:
                return User.objects.create(email=validated_data["email"],password=validated_data["password"],first_name=validated_data["first_name"],last_name=validated_data["last_name"],enrollment=validated_data['enrollment'], is_admin=False, is_active=False)
        else:
            return User.objects.create(email=validated_data["email"],password=validated_data["password"],first_name=validated_data["first_name"],last_name=validated_data["last_name"],enrollment=validated_data['enrollment'], is_admin=False, is_active=True)
