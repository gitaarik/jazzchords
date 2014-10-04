from django.conf.urls import url
from ..views import signup as views


urlpatterns = [
    url(r'^$', views.signup, name='signup'),
    url(r'^validate-email/$', views.validate_email, name='validate_email'),
    url(r'^completed/$', views.completed, name='completed'),
]
