from django.db import models


class Tweet(models.Model):
    text = models.CharField(max_length=50, blank=False)
    date = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=20, blank=False)
