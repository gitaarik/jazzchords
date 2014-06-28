from django.conf.urls import url, include
from rest_framework_nested import routers
from .views_api import (
    ChartViewSet, SectionViewSet, LineViewSet, MeasureViewSet,
    ChordViewSet, ChartSongNameView, SectionKeyView
)

charts_router = routers.SimpleRouter(trailing_slash=False)
charts_router.register('charts', ChartViewSet)

sections_router = routers.NestedSimpleRouter(
    charts_router, 'charts',
    lookup='chart', trailing_slash=False
)
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

urlpatterns = [
    url('^', include(charts_router.urls)),
    url('^', include(sections_router.urls)),
    url('^', include(lines_router.urls)),
    url('^', include(measures_router.urls)),
    url('^', include(chords_router.urls)),
    url('^chart-song-name/(?P<chart_id>\d+)/$', ChartSongNameView.as_view()),
    url('^section-key/(?P<section_id>\d+)/$', SectionKeyView.as_view())
]
