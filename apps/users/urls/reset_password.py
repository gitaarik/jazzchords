from django.conf.urls import url
from ..views import reset_password as views


urlpatterns = [
    url(r'^$', views.request, name='request'),
    url(r'^requested/$', views.requested, name='requested'),
    url(r'^confirm/$', views.confirm, name='confirm'),
    url(r'^completed/$', views.completed, name='completed'),
]
