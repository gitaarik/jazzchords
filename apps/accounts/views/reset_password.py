from django.shortcuts import render, redirect
from django.core.validators import validate_email as django_validate_email
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.urlresolvers import reverse
from ..models import Account


def request(request):
    """
    The user requests a password reset.
    """

    email = request.POST.get('email') or ''
    errors = []
    response = None

    if email:

        validate_email = django_validate_email
        validate_email.message = "Please enter a valid email address."

        try:
            validate_email(email)
        except ValidationError as error:
            errors = error.messages
        else:

            try:
                account = Account.objects.get(email=email)
            except ObjectDoesNotExist:
                errors = [
                    "There is no account with this email address. You "
                    "can <a href=\"{}\">create<a> it if you like."
                    .format(reverse('accounts:create_account'))
                ]
            else:

                account.validation_token = account._meta.get_field('validation_token').default()
                account.send_reset_password_email()
                account.save()

                response = redirect('accounts:reset_password:requested')
                request.session['reset_password_email'] = email

    if not response:

        response = render(
            request,
            'accounts/reset_password/request.html',
            {
                'email': email,
                'errors': errors
            }
        )

    return response

def requested(request):

    email = request.session.get('reset_password_email')

    return render(
        request,
        'accounts/reset_password/requested.html',
        {'email': email}
    )

def confirm(request):
    """
    The page a user comes to from the password reset email.
    """

    email = request.GET.get('email')
    token = request.GET.get('validation_token')

    return render(
        request,
        'accounts/reset_password/confirm.html',
        {'email': email}
    )

def completed(request):

    return render(
        request,
        'accounts/reset_password/completed.html',
    )
