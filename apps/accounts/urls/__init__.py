from django.conf.urls import include, url
from .. import views


urlpatterns = [
    url(
        r'^create/',
        include('accounts.urls.create', namespace='create')
    ),
    url(
        r'^reset-password/',
        include('accounts.urls.reset_password', namespace='reset_password')
    ),
]
