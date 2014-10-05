from django.conf.urls import include, url
from . import views_ajax


urlpatterns = [
    url(
        r'^update-password/$',
        views_ajax.update_password,
        name='update_password'
    ),
]
