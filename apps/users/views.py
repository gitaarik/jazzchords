from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from .models import User


def register(request):

    response = None
    errors = None
    user = None

    if request.method == 'POST':

        user = User(
            username=request.POST['username'],
            password=request.POST['password'],
            email=request.POST['email']
        )

        try:
            user.full_clean()
        except Exception as error:
            errors = error.message_dict
        else:

            try:
                user.save()
            except Exception as error:
                errors = error.message_dict
            else:

                user.send_confirmation_email()
                response = render(request, 'users/registered.html')

    if not response:

        response = render(
            request,
            'users/register.html',
            {'errors': errors, 'user': user}
        )

    return response


def validate_email(request):

    success = False

    try:
        user = User.objects.get(email=request.GET.get('email'))
    except ObjectDoesNotExist:
        pass
    else:

        if request.GET.get('validation_token') == user.email_validation_token:
            success = True

    if success:
        user.email_validated = True
        user.save()

    return render(
        request,
        'users/validate_email.html',
        {'success': success}
    )
