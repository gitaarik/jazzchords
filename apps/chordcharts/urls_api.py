from django.conf.urls import patterns, url, include
from rest_framework import routers
from .views_api import SectionViewSet


router = routers.DefaultRouter(trailing_slash=False)
router.register(r'sections', SectionViewSet)

urlpatterns = patterns('',
    url(
        r'^(?P<song_slug>[a-z-_]*)/',
        include(router.urls),
        name='chart',
    )
)
