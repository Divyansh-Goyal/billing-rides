from django.db import models
from django.contrib.auth.models import PermissionsMixin, AbstractBaseUser, BaseUserManager
from rest_framework_simplejwt.tokens import RefreshToken
from six import text_type
# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, first_name,last_name,email,password, enrollment="", is_admin=True):
        if email is None:
            raise TypeError('Users must have an email address.')

        user = self.model(email=self.normalize_email(email),first_name=first_name,last_name=last_name, enrollment=enrollment, is_admin=is_admin)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email,password,first_name=None,last_name=None):
        if password is None:
            raise TypeError('Superusers must have a password.')

        admin = self.create_user(first_name,last_name,email,password)
        admin.is_superuser = True
        admin.is_staff = True
        admin.save()
        return admin

class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255,null=True,blank=True)
    last_name=models.CharField(max_length=255,null=True,blank=True)
    email = models.EmailField(unique=True)
    enrollment = models.CharField(max_length=12,null=True, blank=True, unique=True)
    is_admin = models.BooleanField(default=False) 
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'

    objects = UserManager()


    def __str__(self):
        return self.email
    @property
    def refresh(self):
        return self._generate_refresh_token()
    @property
    def access(self):
        return self._generate_access_token()
    def _generate_refresh_token(self):
        tokens = RefreshToken.for_user(self)
        refresh = text_type(tokens)
        return refresh
    def _generate_access_token(self):
        tokens = RefreshToken.for_user(self)
        access = text_type(tokens.access_token)
        return access