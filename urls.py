from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.staticfiles.views import serve as serve_static
from django.views.decorators.cache import never_cache


admin.autodiscover()
urlpatterns = patterns('', )

api_urls = patterns(
    '',
    url(
        '^chordcharts/',
        include('chordcharts.urls_api', namespace='chordcharts')
    )
)

urlpatterns += patterns(
    '',
    url('^grappelli/', include('grappelli.urls')),
    url('^admin/doc/', include('django.contrib.admindocs.urls')),
    url('^admin/', include(admin.site.urls)),
    url('^chart/', include('chordcharts.urls', namespace='chordcharts')),
    url('^api/', include(api_urls, namespace='api')),
    url(
        '^api-auth/',
        include('rest_framework.urls', namespace='rest_framework')
    )
)

if settings.DEBUG:
    urlpatterns += patterns(
        '',
        url('^static/(?P<path>.*)$', never_cache(serve_static)),
    )
