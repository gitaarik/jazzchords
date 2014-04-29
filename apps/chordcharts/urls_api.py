from django.conf.urls import patterns, url, include
from rest_framework_nested import routers
from .views_api import SectionViewSet, LineViewSet


sections_router = routers.SimpleRouter(trailing_slash=False)
sections_router.register(r'sections', SectionViewSet)

lines_router = routers.NestedSimpleRouter(
    sections_router, 'sections', lookup='section', trailing_slash=False
)
lines_router.register(r'lines', LineViewSet)

chart_urlpatterns = patterns('',
    url('^', include(sections_router.urls)),
    url('^', include(lines_router.urls)),
)

urlpatterns = patterns('',
    url(
        r'^(?P<song_slug>[a-z-_]+)/'
        '(?P<chart_id>\d+)/',
        include(chart_urlpatterns),
        name='chart',
    ),
)
