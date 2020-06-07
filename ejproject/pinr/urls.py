from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.base, name="base"),
    path('find_route', views.find_route, name="find_route"),
    path('find_place', views.find_place, name="find_place"),
]
