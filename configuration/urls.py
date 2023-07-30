from django.urls import path, include
from configuration.views import AdminResourceAPIView, AdminGetListView, CalculationView
from .models import Configuration
from .serializers import ConfigurationSerializer
urlpatterns = [
    path('config/<int:pk>', AdminResourceAPIView.as_view(
        model = Configuration,
        resource_serializer = ConfigurationSerializer
    )),
    path('config/<str:page>', AdminGetListView.as_view(
        model = Configuration,
        resource_serializer = ConfigurationSerializer
    )),
    path('calculation/',CalculationView.as_view())
]