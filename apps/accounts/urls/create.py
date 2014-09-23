from django.conf.urls import url
from ..views import create as views


urlpatterns = [
    url(r'^$', views.create, name='create'),
    url(r'^validate-email/$', views.validate_email, name='validate_email'),
    url(r'^completed/$', views.completed, name='completed'),
]
