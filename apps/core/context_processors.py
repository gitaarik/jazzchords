from django.conf import settings as proj_settings


def settings(request):

    return {
        'DEBUG': proj_settings.TEMPLATE_DEBUG,
    }
