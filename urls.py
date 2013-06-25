from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin


admin.autodiscover()
urlpatterns = patterns('', )

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.STATIC_ROOT,
        }),
    )

urlpatterns += patterns('',
    url(
        r'^chart/(?P<song_slug>[a-z-_]*)/'
         '(?:(?P<key_slug>[a-z-_]*)/)?$',
        'chordcharts.views.chart',
        name='chart'
    ),
    url(r'^grappelli/', include('grappelli.urls')),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
