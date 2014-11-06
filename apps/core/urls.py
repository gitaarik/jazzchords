from django.conf.urls import url


urlpatterns = [
    url(r'^$', 'core.views.frontpage', name='frontpage'),
]
