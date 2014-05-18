from django.conf.urls import patterns, url, include
from rest_framework_nested import routers
from .views_api import (
    SectionViewSet, LineViewSet,
    MeasureViewSet, ChordViewSet
)


sections_router = routers.SimpleRouter(trailing_slash=False)
sections_router.register('sections', SectionViewSet)

lines_router = routers.NestedSimpleRouter(
    sections_router, 'sections',
    lookup='section', trailing_slash=False
)
lines_router.register('lines', LineViewSet)

measures_router = routers.NestedSimpleRouter(
    lines_router, 'lines',
    lookup='line', trailing_slash=False
)
measures_router.register('measures', MeasureViewSet)

chords_router = routers.NestedSimpleRouter(
    measures_router, 'measures',
    lookup='measure', trailing_slash=False
)
chords_router.register('chords', ChordViewSet)


chart_urlpatterns = patterns('',
    url('^', include(sections_router.urls)),
    url('^', include(lines_router.urls)),
    url('^', include(measures_router.urls)),
    url('^', include(chords_router.urls)),
)

urlpatterns = patterns('',
    url(
        r'^(?P<song_slug>[a-z-_]+)/'
        '(?P<chart_id>\d+)/',
        include(chart_urlpatterns),
        name='chart',
    ),
)
