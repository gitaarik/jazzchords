from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from core.helpers import form
from ..forms import ResetPasswordRequestForm, ResetPasswordConfirmForm
from ..decorators import redirect_authenticated


@redirect_authenticated
def request(request):
    """
    The user requests a password reset.
    """

    response = None
    reset_password_request_form = ResetPasswordRequestForm(request.POST)

    if request.method == 'POST':

        form_submitted = True
        user = reset_password_request_form.reset_password_request()

        if user:
            response = redirect('users:reset_password:requested')
            request.session['reset_password_email'] = user.email

    else:
        form_submitted = False

    if not response:

        field_info = form.field_info(reset_password_request_form, form_submitted)

        response = render(
            request,
            'users/reset-password/request.html',
            context={'fields': field_info}
        )

    return response


@redirect_authenticated
def requested(request):
    """
    The page after a successful password reset request, where the user
    get's instructed to check his email for further instructions.
    """

    email = request.session.get('reset_password_email')

    return render(
        request,
        'users/reset-password/requested.html',
        {'email': email}
    )


@redirect_authenticated
def confirm(request):
    """
    The page a user comes to from the password reset email.

    Validates the validation token.

    When it's valid:
        Redirects the user to the reset password page.
    When it's invalid:
        Shows an error page in case.
    """

    if request.user.is_anonymous():
        user = authenticate(
            username=request.GET.get('email'),
            validation_token=request.GET.get('validation_token')
        )
    else:
        user = request.user

    if user:
        login(request, user)
        response = redirect('users:reset_password:reset')
    else:
        response = render(
            request,
            'users/reset-password/invalid-token.html'
        )

    return response


@login_required
def reset(request):
    """
    The page a validated user comes to from the password reset email.
    """

    user = request.user
    response = None
    context = {}
    reset_password_confirm_form = (
        ResetPasswordConfirmForm(request.POST, user)
    )

    if request.method == 'POST':

        if reset_password_confirm_form.reset_password():
            response = redirect('users:reset_password:completed')
        else:

            form.copy_global_error(
                reset_password_confirm_form,
                'passwords_mismatch',
                'new_password1'
            )

            context.update({
                'data': reset_password_confirm_form.data,
                'errors': reset_password_confirm_form.errors
            })

    if not response:

        context['fields'] = reset_password_confirm_form.fields

        response = render(
            request,
            'users/reset-password/confirm.html',
            context
        )

    return response


def completed(request):
    """
    The page the user sees when the password reset has been completed.
    """

    return render(
        request,
        'users/reset-password/completed.html',
    )
