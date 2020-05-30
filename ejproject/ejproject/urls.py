"""ejproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from pinr import views
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('index1/', views.index1, name='index1'),
    path('index2/', views.index2, name='index2'),
    #path('index1/side1/', views.side1, name='side1'),
    #path('index1/side2/', views.side2, name='side2'),
    path('index1/side1/', TemplateView.as_view(template_name="side1.html"), name='side1'),
    path('index1/side2/', TemplateView.as_view(template_name="side2.html"), name='side2'),
]
