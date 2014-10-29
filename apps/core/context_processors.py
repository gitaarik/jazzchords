from django.conf import settings as django_settings


def settings(request):

    return {
        'core__settings': django_settings
    }
