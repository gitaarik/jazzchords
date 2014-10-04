from django.shortcuts import render, redirect
from django.core.validators import validate_email as django_validate_email
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from ..models import User
from ..forms import ResetPasswordRequestForm, ResetPasswordConfirmForm


def request(request):
    """
    The user requests a password reset.
    """

    response = None
    context = {}
    reset_password_request_form = ResetPasswordRequestForm(request.POST)

    if request.method == 'POST':

        user = reset_password_request_form.reset_password_request()

        if user:
            response = redirect('users:reset_password:requested')
            request.session['reset_password_email'] = user.email
        else:
            context.update({
                'data': reset_password_request_form.data,
                'errors': reset_password_request_form.errors
            })

    if not response:

        context['fields'] = reset_password_request_form.fields

        response = render(
            request,
            'users/reset_password/request.html',
            context
        )

    return response

def requested(request):
    """
    The page after a successful password reset request, where the user
    get's instructed to check his email for further instructions.
    """

    email = request.session.get('reset_password_email')

    return render(
        request,
        'users/reset_password/requested.html',
        {'email': email}
    )

def confirm(request):
    """
    The page a user comes to from the password reset email.
    """

    email = request.GET.get('email')
    validation_token = request.GET.get('validation_token')
    valid = False

    try:
        user = User.objects.get(email=email)
    except ObjectDoesNotExist:
        user = None
    else:
        if user.validation_token == validation_token:
            valid = True

    if valid:
        response = confirm_valid(request, user)
    else:
        response = render(
            request,
            'users/reset_password/invalid_token.html'
        )

    return response

def confirm_valid(request, user):
    """
    The page a validated user comes to from the password reset email.
    """

    response = None
    context = {}
    reset_password_confirm_form = (
        ResetPasswordConfirmForm(request.POST, user)
    )

    if request.method == 'POST':

        if reset_password_confirm_form.reset_password():
            response = redirect('users:reset_password:completed')
        else:
            context.update({
                'data': reset_password_confirm_form.data,
                'errors': reset_password_confirm_form.errors,
                'errors_all': reset_password_confirm_form.errors.get('__all__')
            })

    if not response:

        context['fields'] = reset_password_confirm_form.fields

        response = render(
            request,
            'users/reset_password/confirm.html',
            context
        )

    return response

def completed(request):
    """
    The page the user sees when the password reset has been completed.
    """

    return render(
        request,
        'users/reset_password/completed.html',
    )
