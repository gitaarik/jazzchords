from django.shortcuts import render, redirect
from django.core.validators import validate_email as django_validate_email
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.urlresolvers import reverse
from ..models import User


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
                user = User.objects.get(email=email)
            except ObjectDoesNotExist:
                errors = [
                    "There is no account with this email address. You "
                    "can <a href=\"{}\">create<a> it if you like."
                    .format(reverse('users:create_account'))
                ]
            else:

                user.validation_token = user._meta.get_field('validation_token').default()
                user.send_reset_password_email()
                user.save()

                response = redirect('users:reset_password:requested')
                request.session['reset_password_email'] = email

    if not response:

        response = render(
            request,
            'users/reset_password/request.html',
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
        'users/reset_password/requested.html',
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
        'users/reset_password/confirm.html',
        {'email': email}
    )

def completed(request):

    return render(
        request,
        'users/reset_password/completed.html',
    )
