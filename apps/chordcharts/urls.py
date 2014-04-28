from django.conf.urls import patterns, url


urlpatterns = patterns('',
    url(
        r'^edit/'
        '(?P<song_slug>[a-z-_]+)/'
        '(?P<chart_id>\d+)/'
        '(?:(?P<key_slug>[a-z-_]+)/)?$',
        'chordcharts.views.chart',
        {'edit': True},
        name='chart_edit',
    ),
    url(
        r'^(?P<song_slug>[a-z-_]+)/'
        '(?P<chart_id>\d+)/'
        '(?:(?P<key_slug>[a-z-_]+)/)?$',
        'chordcharts.views.chart',
        name='chart'
    ),
)
