from .general import INSTALLED_APPS


DEBUG = True
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'database.sqlite',
        'USER': '',
        'PASSWORD': '',
    }
}

INSTALLED_APPS += ('django.contrib.staticfiles',)

DOMAIN_NAME = 'localhost'
