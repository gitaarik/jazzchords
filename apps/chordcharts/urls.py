from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^index/$', views.index, name='index'),
    url(
        '^(?P<chart_id>\d+)/'
        '(?:(?P<song_slug>[a-z0-9-_]+)/)?'
        '(?:(?P<key_tonic>[A-Z#♭]+)/)?$',
        views.chart,
        name='chart'
    ),
    url(
        r'versions/(?P<song_slug>[a-z0-9-_]+)/',
        views.versions,
        name='versions'
    ),
    url(r'^new/', views.new_chart, name='new_chart'),
    url(
        r'^edit/'
        '(?P<chart_id>\d+)/'
        '(?:(?P<song_slug>[a-z0-9-_]+)/)?$',
        views.chart,
        {'edit': True},
        name='edit_chart',
    ),
    url(
        r'^delete/'
        '(?P<song_slug>[a-z0-9-_]+)/'
        '(?P<chart_id>\d+)/$',
        views.delete_chart,
        name='delete_chart',
    ),
    url(r'^how-to-read/$', views.how_to_read, name='how_to_read'),
    url(r'^chord-symbols/$', views.chord_symbols, name='chord_symbols')
]
