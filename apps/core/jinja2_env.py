from django.core.urlresolvers import reverse
from django.conf import settings as django_settings
from django.contrib.staticfiles.storage import staticfiles_storage
from jinja2 import Environment


def environment(**options):
    env = Environment(**options)
    env.globals.update({
        'static': staticfiles_storage.url,
        'url': reverse,
        'settings': django_settings
    })
    return env
