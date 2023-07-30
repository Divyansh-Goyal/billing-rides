from django.db import models
from users.models import User
from django.utils import timezone
# Create your models here.


class Configuration(models.Model):
    day = models.CharField(max_length=255)
    distance_base_price = models.FloatField()
    distance_base_km = models.FloatField(default=1);
    distance_additional_price = models.FloatField()
    time_multiplier_factor = models.FloatField()
    waiting_charge = models.FloatField()
    base_waiting_time = models.FloatField(default=1)
    created_at = models.DateTimeField(default = timezone.now)