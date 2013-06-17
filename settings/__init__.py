from environment import ENVIRONMENT
from .general import *

if ENVIRONMENT == 'development':

    from .development import *

    try:
        from .local import *
    except:
        pass
