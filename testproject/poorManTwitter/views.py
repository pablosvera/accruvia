from django.http import JsonResponse
from django.shortcuts import render
from .models import Tweet
from rest_framework.views import APIView
from .serializers import TweetSerializer
from rest_framework import status


def index(request):
    latest_question_list = Tweet.objects.order_by('-date', '-name')
    context = {'latest_question_list': latest_question_list}
    return render(request, 'poorManTwitter/index.html', context)


class Tweets(APIView):
    def get(self, request):
        # I return the tweets showing the most recent tweets first
        tweets = Tweet.objects.all().order_by('-date', '-name')
        serializer = TweetSerializer(tweets, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        newTweet = TweetSerializer(data=request.data)
        if newTweet.is_valid():
            newTweet.save()
            # According to REST best practices, I should return the URL of the created resource
            # However that's wouldn't be valid as there's not URL to get the created resource
            # We only have the url to return the list of Tweets
            return JsonResponse(data='', status=status.HTTP_201_CREATED, safe=False)
        return JsonResponse(newTweet.errors, status=status.HTTP_400_BAD_REQUEST)
