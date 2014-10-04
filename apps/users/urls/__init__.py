from django.conf.urls import include, url
from .. import views


urlpatterns = [
    url(
        r'^signup/',
        include('users.urls.signup', namespace='signup')
    ),
    url(
        r'^reset-password/',
        include('users.urls.reset_password', namespace='reset_password')
    ),
]
