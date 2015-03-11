from django.conf import settings as django_settings


def default(request):

    return {
        'g__settings': django_settings,
        'g__request': request
    }
