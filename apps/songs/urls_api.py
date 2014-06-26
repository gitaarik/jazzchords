from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from .views_api import SongViewSet


songs_router = DefaultRouter(trailing_slash=False)
songs_router.register('songs', SongViewSet)

urlpatterns = [
    url('^', include(songs_router.urls))
]
