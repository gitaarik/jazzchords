from .general import INSTALLED_APPS


DEBUG = False
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'jazzchords',                      
        'USER': 'jazzchords',
        'PASSWORD': 's3cRut@s$H!t',
        'HOST': 'localhost'
    }
}

DOMAIN_NAME = 'jazzchords.com'
WEBSITE_URL = 'http://www.{}'.format(DOMAIN_NAME)

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
        'PATH': os.path.join(DEV_ROOT, 'whoosh_index'),
        'INCLUDE_SPELLING': True
    },
}
