from .general import INSTALLED_APPS


DEBUG = False
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': '',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
    }
}

DOMAIN_NAME = 'jazzchords.com'
WEBSITE_URL = 'http://www.{}'.format(DOMAIN_NAME)
