from django.conf.urls import patterns, url, include
from rest_framework.routers import DefaultRouter
from .views_api import SongViewSet


songs_router = DefaultRouter(trailing_slash=False)
songs_router.register('songs', SongViewSet)

urlpatterns = patterns(
    '',
    url('^', include(songs_router.urls))
)
