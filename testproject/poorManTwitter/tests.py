from cgitb import text
import datetime
from django.test import TestCase
from django.utils import timezone
from .models import Tweet
from django.urls import reverse
from rest_framework import status
import json
from dateutil import parser


class TweetModelTests(TestCase):

    def test_date_should_autopopulate(self):
        """
        Adding a tweet should set its date automatically
        """
        tweet = Tweet.objects.create(text='some text', name='Pablo')
        tweet.save()
        time = timezone.now() - datetime.timedelta(seconds=2)
        self.assertIs(timezone.now() >= tweet.date > time, True)


def create_tweet(tweet_text, tweet_name):
    """
    Create a tweet with the given `tweet_text` and `tweet_name`
    """
    return Tweet.objects.create(text=tweet_text, name=tweet_name)


class QuestionIndexViewTests(TestCase):
    def test_no_tweets(self):
        """
        If no tweets exist, it must return an empty array.
        """
        response = self.client.get(reverse('tweets'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, b'[]')

    def test_tweets_should_be_ordered(self):
        """
        Tweets should be ordered by creation date and name.
        """
        tweet_text = 'random text'
        tweet_name = 'random name'
        create_tweet(tweet_text, tweet_name)
        create_tweet(tweet_text + ' 2', tweet_name + ' 2')

        response = self.client.get(reverse('tweets'))
        tweets = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(tweets[0]['text'], tweet_text + ' 2')
        self.assertEqual(tweets[1]['text'], tweet_text)
        self.assertEqual(tweets[0]['name'], tweet_name + ' 2')
        self.assertEqual(tweets[1]['name'], tweet_name)
        date_first_tweet = parser.parse(tweets[1]['date'])
        date_second_tweet = parser.parse(tweets[0]['date'])
        self.assertGreaterEqual(date_second_tweet, date_first_tweet)


class QuestionPostViewTests(TestCase):
    def test_name_is_required(self):
        """
        You shouldn't be allowed to create a tweet without a name
        """
        url = reverse('tweets')
        data = {'text': 'some text to tweet'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_text_is_required(self):
        """
        You shouldn't be allowed to create a tweet without a text
        """
        url = reverse('tweets')
        data = {'name': 'Pablo'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_tweet_is_created(self):
        """
        You should be allowed to create a complete tweet 
        """
        url = reverse('tweets')
        data = {'name': 'Pablo', 'text': 'some text to tweet'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_a_tweet_should_return_empty_response(self):
        """
        When you create a tweet you should receive an empty response
        """
        url = reverse('tweets')
        data = {'name': 'Pablo', 'text': 'some text to tweet'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.content, b'""')
