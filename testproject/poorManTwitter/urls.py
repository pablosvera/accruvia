from django.urls import path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

urlpatterns = [
    # ex: /
    path('', views.index, name='index'),
    # ex: /api/
    path('tweets', views.Tweets.as_view(), name='tweets'),
    # ex: /api/v1/

]
