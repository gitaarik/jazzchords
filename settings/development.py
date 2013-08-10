from .general import MIDDLEWARE_CLASSES


DEBUG = True
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

MIDDLEWARE_CLASSES = (
    MIDDLEWARE_CLASSES + (
        'core.middleware.south_unran_migration_check.SouthUnranMigrationCheck',
    )
)
