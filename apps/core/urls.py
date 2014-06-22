from django.conf.urls import patterns, url


urlpatterns = patterns(
    '',
    url(r'^$', 'core.views.coming_soon', name='coming_soon')
)
