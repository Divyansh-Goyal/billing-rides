from django.contrib import admin
from .models import Configuration
from .serializers import ConfigurationSerializer
from .importAction import ExportCsvMixin



class ConfigurationAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ["day"]
    ordering = ["id"]
    actions = ["export_as_csv"]



admin.site.register(Configuration, ConfigurationAdmin)
