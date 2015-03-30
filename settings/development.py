import os
from .general import INSTALLED_APPS, DEV_ROOT


DEBUG = True
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'dev/database.sqlite',
        'USER': '',
        'PASSWORD': '',
    }
}

INSTALLED_APPS += ('django.contrib.staticfiles',)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

DOMAIN_NAME = 'localhost'
WEBSITE_URL = 'http://{}:8000'.format(DOMAIN_NAME)

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
        'PATH': os.path.join(DEV_ROOT, 'whoosh_index'),
        'INCLUDE_SPELLING': True
    },
    #'default': {
    #    'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
    #    'URL': 'http://127.0.0.1:9200/',
    #    'INDEX_NAME': 'haystack',
    #},
}
