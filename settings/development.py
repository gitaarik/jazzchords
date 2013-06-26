from .general import MIDDLEWARE_CLASSES


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

MIDDLEWARE_CLASSES = (
    MIDDLEWARE_CLASSES +
    ('middleware.south_unran_migration_check.SouthUnranMigrationCheck',)
)
