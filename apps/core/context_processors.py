from django.conf import settings as proj_settings


def settings(request):

    return {
        'DEBUG': proj_settings.TEMPLATE_DEBUG,
        'LESS_WATCH': proj_settings.LESS_WATCH,
    }
