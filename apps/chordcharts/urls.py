from django.conf.urls import url


urlpatterns = [
    url(
        r'^index/$',
        'chordcharts.views.song_index',
        name='song_index'
    ),
    url(
        '^(?P<chart_id>\d+)/'
        '(?:(?P<song_slug>[a-z0-9-_]+)/)?'
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
        '(?P<chart_id>\d+)/'
        '(?:(?P<song_slug>[a-z0-9-_]+)/)?'
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
    ),
    url(
        r'^how-to-read/$',
        'chordcharts.views.how_to_read',
        name='how_to_read'
    ),
    url(
        r'^chord-symbols/$',
        'chordcharts.views.chord_symbols',
        name='chord_symbols'
    )
]
