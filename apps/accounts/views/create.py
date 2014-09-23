from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist

from core.helpers.fields_maxlength import fields_maxlength
from ..models import Account
from ..helpers.create_account import CreateAccount


def create(request):
    """
    Where the user can create a new account.
    """

    create_account = CreateAccount(request)

    if create_account.process():
        request.session['create_account_email'] = create_account.account.email
        response = redirect('accounts:create:validate_email')
    else:
        response = render(
            request,
            'accounts/create/create.html',
            {
                'errors': create_account.errors,
                'account': create_account.account,
                'maxlength': fields_maxlength(
                    Account, ['username', 'password', 'email']
                )
            }
        )

    return response


def validate_email(request):
    """
    The page after a successful account creation.
    """

    email = request.session.get('create_account_email')

    return render(
        request,
        'accounts/create/validate_email.html',
        {'email': email}
    )


def completed(request):
    """
    The page the user comes to from the "validate email address" email.
    """

    success = False

    try:
        account = Account.objects.get(email=request.GET.get('email'))
    except ObjectDoesNotExist:
        pass
    else:

        if request.GET.get('validation_token') == account.validation_token:
            success = True

    if success:
        account.validated = True
        account.save()

    return render(
        request,
        'accounts/create/completed.html',
        {'success': success}
    )
