from django.conf.urls import url


urlpatterns = [
    url(r'^$', 'core.views.coming_soon', name='coming_soon')
]
