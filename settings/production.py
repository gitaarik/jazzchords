from .general import INSTALLED_APPS


DEBUG = False
TEMPLATE_DEBUG = DEBUG

# Watch LESS files - automatically refresh less changes.
# You can also temporarily enable watching by appending #!watch to the url.
LESS_WATCH = False

COMPRESS_ENABLED = False
COMPRESS_PRECOMPILERS = ()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'database.sqlite',
        'USER': '',
        'PASSWORD': '',
    }
}

INSTALLED_APPS += ('django.contrib.staticfiles',)
