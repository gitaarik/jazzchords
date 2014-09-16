from django.conf.urls import url


urlpatterns = [
    url(r'^register/$', 'users.views.register', name='register')
]
