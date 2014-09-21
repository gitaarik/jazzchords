from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^create-account/$', views.create_account, name='create_account'),
    url(r'^account-created/$', views.account_created, name='account_created'),
    url(r'^validate-email/$', views.validate_email, name='validate_email'),
    url(r'^reset-password/$', views.reset_password, name='reset_password')
]
