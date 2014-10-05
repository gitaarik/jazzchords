from django.conf.urls import url
from ..views import signup as views


urlpatterns = [
    url(r'^$', views.signup, name='signup'),
    url(
        r'^resend-validation-email/$',
        views.resend_validation_email,
        name='resend_validation_email'
    ),
    url(r'^validate-email/$', views.validate_email, name='validate_email'),
    url(r'^completed/$', views.completed, name='completed'),
]
