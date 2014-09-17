from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^register/$', views.register, name='register'),
    url(r'^validate-email/$', views.validate_email, name='validate_email')
]
