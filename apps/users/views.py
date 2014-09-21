from django.core.validators import validate_email as django_validate_email
from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from core.helpers.fields_maxlength import fields_maxlength
from .models import User
from .helpers.create_account import CreateAccount


def create_account(request):
    """
    Where the user can create a new account.
    """

    create_account = CreateAccount(request)

    if create_account.process():
        response = redirect('users:account_created')
    else:
        response = render(
            request,
            'users/create_account.html',
            {
                'errors': create_account.errors,
                'user': create_account.user,
                'maxlength': fields_maxlength(
                    User, ['username', 'password', 'email']
                )
            }
        )

    return response


def account_created(request):
    """
    The page after a successful account creation.
    """
    return render(request, 'users/account_created.html')


def validate_email(request):
    """
    The page the user comes to from the "validate email address" email.
    """

    success = False

    try:
        user = User.objects.get(email=request.GET.get('email'))
    except ObjectDoesNotExist:
        pass
    else:

        if request.GET.get('validation_token') == user.validation_token:
            success = True

    if success:
        user.validated = True
        user.save()

    return render(
        request,
        'users/validate_email.html',
        {'success': success}
    )


def reset_password(request):
    """
    Proxy view that decides which view in the password reset process
    should be processed.
    """

    if 'token' in request.GET:
        return reset_password_validated(request)
    else:
        return reset_password_request(request)


def reset_password_request(request):
    """
    The user requests a password reset.
    """

    email = request.POST.get('email') or ''
    errors = []

    if email:

        validate_email = django_validate_email
        validate_email.message = "Please enter a valid email address."

        try:
            validate_email(email)
        except ValidationError as error:
            errors = error.messages
        else:

            user = User.objects.get(email=email)
            user.validation_token = user._meta.get_field('validation_token').default()
            user.send_reset_password_email()
            user.save()

            response = render(
                request,
                'users/reset_password_request_success.html'
            )

    return render(
        request,
        'users/reset_password.html',
        {
            'email': email,
            'errors': errors
        }
    )

def reset_password_validated(request):
    """
    The page a user comes to from the password reset email.
    """

    email = request.GET.get('email')
    token = request.GET.get('token')

    #if 
