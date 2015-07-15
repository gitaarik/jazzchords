from core.helpers.form import copy_global_error
from django.shortcuts import render, redirect
from django.contrib.auth import (
    login as django_login,
    logout as django_logout
)
from django.contrib.auth.decorators import login_required

from ..forms import LoginForm
from ..decorators import redirect_authenticated


@redirect_authenticated
def login(request):
    """
    The page a user can log in.
    """

    response = None
    context = {
        'data': None,
        'errors': None
    }
    login_form = LoginForm(request.POST)

    if request.method == 'POST':

        if login_form.is_valid():
            django_login(request, login_form.get_user())
            response = redirect('users:home')
        else:
            copy_global_error(login_form, 'login_failed', 'username_email')
            copy_global_error(login_form, 'not_validated', 'username_email')
            context.update({
                'data': login_form.data,
                'errors': login_form.errors
            })

    if not response:
        context['fields'] = login_form.fields
        return render(request, 'users/login.html', context)

    return response


def logout(request):
    django_logout(request)
    return redirect('core:frontpage')


@login_required
def home(request):
    return render(request, 'users/home.html', {'user': request.user})
