from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist

from core.helpers.fields_maxlength import fields_maxlength
from ..models import User
from ..forms import SignUpForm


def signup(request):
    """
    Where the user can sign up.
    """

    response = None
    context = {}
    sign_up_form = SignUpForm(request.POST)

    if request.method == 'POST':

        if sign_up_form.is_valid():
            user = sign_up_form.signup()
            request.session['signup_email'] = user.email
            response = redirect('users:signup:validate_email')
        else:
            context.update({
                'data': sign_up_form.data,
                'errors': sign_up_form.errors
            })

    if not response:

        context['fields'] = sign_up_form.fields

        response = render(
            request,
            'users/signup/signup.html',
            context
        )

    return response


def validate_email(request):
    """
    The page after a successful sign up, where the user gets
    instructions about the validation email.
    """

    email = request.session.get('signup_email')

    return render(
        request,
        'users/signup/validate_email.html',
        {'email': email}
    )


def completed(request):
    """
    The page the user comes to from the "validate email address" email,
    where his/her email address gets validated.
    """

    success = False

    try:
        user = User.objects.get(email=request.GET.get('email'))
    except ObjectDoesNotExist:
        pass
    else:

        if (
            user.validated or
            user.validate_with_token(request.GET.get('validation_token'))
        ):
            success = True

    return render(
        request,
        'users/signup/completed.html',
        {'success': success}
    )
