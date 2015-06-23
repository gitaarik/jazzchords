from django.conf.urls import include, url

about_urls = [
    url(r'^$', 'core.views.about', name='about'),
    url(r'^team/$', 'core.views.about_team', name='team'),
    url(r'^contribute/$', 'core.views.about_contribute', name='contribute'),
]

urlpatterns = [
    url(r'^$', 'core.views.frontpage', name='frontpage'),
    url(r'^about/', include(about_urls, namespace='about')),
    url(r'^contact/', 'core.views.contact', name='contact'),
    url(r'^test/$', 'core.views.test', name='test'),
]
