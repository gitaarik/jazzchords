from django.conf.urls import patterns, url


urlpatterns = patterns(
    '',
    url(
        r'^(?P<song_slug>[a-z0-9-_]+)/'
        '(?P<chart_id>\d+)/'
        '(?:(?P<key_slug>[a-z0-9-_]+)/)?$',
        'chordcharts.views.chart',
        name='chart'
    ),
    url(
        r'^new/',
        'chordcharts.views.new_chart',
        name='chart_new',
    ),
    url(
        r'^edit/'
        '(?P<song_slug>[a-z0-9-_]+)/'
        '(?P<chart_id>\d+)/'
        '(?:(?P<key_slug>[a-z0-9-_]+)/)?$',
        'chordcharts.views.chart',
        {'edit': True},
        name='chart_edit',
    ),
    url(
        r'^delete/'
        '(?P<song_slug>[a-z0-9-_]+)/'
        '(?P<chart_id>\d+)/$',
        'chordcharts.views.chart_delete',
        name='chart_delete',
    )
)
