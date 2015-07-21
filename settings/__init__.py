try:
    from environment import ENVIRONMENT
except ImportError:
    ENVIRONMENT = 'development'

from .general import *

if ENVIRONMENT == 'development':
    from .development import *
elif ENVIRONMENT == 'production':
    from .production import *

try:
    from .local import *
except ImportError:
    pass
