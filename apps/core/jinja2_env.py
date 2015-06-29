from django.core.urlresolvers import reverse
from django.conf import settings as django_settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.shortcuts import render as django_render

from jinja2 import Environment


def environment(**options):
    env = Environment(**options)
    env.globals.update({
        'static': staticfiles_storage.url,
        'url': reverse,
        'settings': django_settings
    })
    return env


def render(request, template_name, context={}, *args, **kwargs):

    context.update({
        'request': request,
    })

    return django_render(request, template_name, context, *args, **kwargs)
