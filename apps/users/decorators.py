from functools import wraps
from django.shortcuts import redirect


def redirect_authenticated(func):

    @wraps(func)
    def decorator_func(request, *args, **kwargs):
        if request.user.is_authenticated():
            return redirect('users:home')
        else:
            return func(request, *args, **kwargs)

    return decorator_func
