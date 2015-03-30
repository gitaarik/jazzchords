from django.conf.urls import url
from .views_api import SearchSongs


urlpatterns = [
    url('^search/$', SearchSongs.as_view())
]
