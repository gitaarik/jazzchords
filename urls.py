from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls.static import static


admin.autodiscover()

ajax_urls = [
    url('^users/', include('users.urls_ajax', namespace='users'))
]

api_urls = [
    url(
        '^chordcharts/',
        include('chordcharts.urls_api', namespace='chordcharts')
    ),
    url('^songs/', include('songs.urls_api', namespace='songs')),
]

urlpatterns = [
    url('^', include('core.urls', namespace='core')),
    url('^grappelli/', include('grappelli.urls')),
    url('^admin/doc/', include('django.contrib.admindocs.urls')),
    url('^admin/', include(admin.site.urls)),
    url('^users/', include('users.urls', namespace='users')),
    url('^chart/', include('chordcharts.urls', namespace='chordcharts')),
    url(
        r'^search/(?:(?P<search_term>[^&\?\/]+)/)?$',
        'chordcharts.views.search',
        name='search'
    ),
    url('^ajax/', include(ajax_urls, namespace='ajax')),
    url('^api/', include(api_urls, namespace='api')),
    url(
        '^api-auth/',
        include('rest_framework.urls', namespace='rest_framework')
    )
]
