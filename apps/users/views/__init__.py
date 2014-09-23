from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist

from core.helpers.fields_maxlength import fields_maxlength
from ..models import User
from ..helpers.create_account import CreateAccount


def create_account(request):
    """
    Where the user can create a new account.
    """

    create_account = CreateAccount(request)

    if create_account.process():
        request.session['create_account_email'] = create_account.user.email
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

    email = request.session.get('create_account_email')

    return render(
        request,
        'users/account_created.html',
        {'email': email}
    )


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
