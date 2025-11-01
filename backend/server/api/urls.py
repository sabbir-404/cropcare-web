from django.urls import path
from . import views

urlpatterns = [
    # temporary test route 
    path('', views.hello, name='hello'),
    path('test/', views.thelo, name='hello'),
    
]
