try:
    from environment import ENVIRONMENT
except ImportError:
    ENVIRONMENT = 'development'

from .general import *

if ENVIRONMENT == 'development':

    from .development import *

    try:
        from .local import *
    except:
        pass
