from django.conf.urls import patterns, url


urlpatterns = patterns('',
    url(
        r'^(?P<song_slug>[a-z-_]*)/$',
        'chordcharts.api.chart',
        name='chart',
    )
)
