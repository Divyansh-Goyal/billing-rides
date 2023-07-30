from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from users.permissions import IsAdmin, IsStudent
from users.models import User
from users.serializers import UserSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics, mixins
from .models import Configuration
from rest_framework import filters
import datetime

# Create your views here.


class AdminResourceAPIView(APIView):
    """
    All the resource api will be created from here.
    """
    permission_classes = [IsAdmin]
    model = User
    resource_serializer = UserSerializer
    matching_condition = 0

    def get(self, request, pk):
        try:
            resource_item = self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            return Response({'message': 'The resource does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.resource_serializer(resource_item)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        try:
            resource_item = self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            return Response({'message': 'The resource does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.resource_serializer(resource_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        if pk == self.matching_condition:
            serializer = self.resource_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                resource_item = self.model.objects.get(pk=pk)
            except self.model.DoesNotExist:
                return Response({'message': 'The resource does not exist'},status=status.HTTP_400_BAD_REQUEST)
            serializer = self.resource_serializer(resource_item, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SetPagination(PageNumberPagination):

    page_size = 7
    page_size_query_param = 'count'

    def get_paginated_response(self, data):
        return Response(data, status=status.HTTP_200_OK)


class AdminGetListView(generics.ListAPIView):
    model = User
    resource_serializer = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAdmin]
    pagination_class = SetPagination
    filter_backends = [filters.SearchFilter]
    filter_query = []
    filter_data = None
    search_fields = []
    _exclude = None
    search_term = None
    special_filter = []

    def get_queryset(self, page):
        """
        queryset of the Get
        """
        queryset = self.model.objects.all()
        for val in self.filter_query:
            queryset.filter(**val)
        if self.filter_data:
            queryset = queryset.filter(**self.filter_data)
        if self._exclude:
            queryset = queryset.exclude(**self._exclude)
        if self.search_term:
            queryset = self.get_search_results_own(
                queryset, self.search_term)
        return queryset

    def list(self, request, page, *args, **kwargs):
        self.search_term = None
        page_count = request.GET.get('page', None)
        dict1 = {}
        self._exclude = {}
        self._current_special_filter = {}
        for k, v in request.query_params.items():
            fieldValue = v
            try:
                fieldValue = int(v)
            except:
                pass
            if k in self.special_filter:
                self._current_special_filter[k] = fieldValue
                continue
            if k == "search":
                self.search_term = v
                continue
            elif k.endswith("__exclude"):
                self._exclude[k[:-9]] = fieldValue
                continue
            if k.endswith('__in'):
                fieldValue = request.query_params.getlist(k)
            if k.endswith('__date'):
                fieldValue = datetime.datetime.strptime(fieldValue, "%Y-%m-%d")
                dict1[k[:-6]] = fieldValue
                continue
            dict1[k] = fieldValue
        if(request.GET.get('page', None) is not None):
            del dict1['page']
        if(request.GET.get('count', None) is not None):
            del dict1['count']
        self.filter_data = dict1
        queryset = self.get_queryset(page)
        serializer = self.resource_serializer(queryset, many=True)
        if page == 'all':
            length = len(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        page_detail = self.paginate_queryset(serializer.data)
        return self.get_paginated_response(page_detail)


    def get_search_results_own(self, queryset, search_term):
        if search_term == None:
            return queryset
        if len(search_term) == 0:
            return queryset
        search_queries = None
        for index, val in enumerate(self.search_fields):
            temp_field = val
            if not val.endswith("contains"):
                temp_field = "{0}__icontains".format(val)
            temp = dict()
            temp[temp_field] = search_term
            if index == 0:
                search_queries = self.Q1(**temp)
            else:
                search_queries |= self.Q1(**temp)
        if search_queries is not None:
            return queryset.filter(search_queries)
        return queryset



class CalculationView(APIView):
    permission_classes = [IsAuthenticated]
    day_list = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    def validate(self,data):
        try:
            float(data['distance_travelled'])
            float(data['day'])
            float(data['waiting_time'])
            float(data['time'])
            return True
        except:
            return False
    def post(self,request):
        if self.validate(request.data):
            conf_travel = Configuration.objects.filter(day = self.day_list[int(request.data['day'])]).first()
            distance_travelled_ad = float(request.data['distance_travelled']) - conf_travel.distance_base_km
            cal_dst = distance_travelled_ad if distance_travelled_ad > 0 else 0
            waiting_charge = float(request.data['waiting_time']) * conf_travel.waiting_charge / conf_travel.base_waiting_time if float(request.data['waiting_time']) > conf_travel.base_waiting_time else 0
            price = conf_travel.distance_base_price + cal_dst*conf_travel.distance_additional_price + float(request.data['time']) * conf_travel.time_multiplier_factor + waiting_charge
            return Response({'price':price},status=200)
        else:
            return Response({'message':"Please enter details correctly"},status=402)
