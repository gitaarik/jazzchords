from django.shortcuts import render
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
