from django.conf.urls import url


urlpatterns = [
    url(r'^$', 'core.views.frontpage', name='frontpage'),
    url(r'^about/', 'core.views.about', name='about')
]
