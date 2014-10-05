from .general import INSTALLED_APPS


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
