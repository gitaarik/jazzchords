from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.backends import ModelBackend
from .models import User


class UserBackend(ModelBackend):

    def authenticate(self, username=None, password=None, **kwargs):
        """
        Authenticate using - either a username or email address - and a
        password.

        The given `username` can either be a username or an email
        address. This method checks if the value of `username` is either
        a username or an email address, and uses that to get the account
        associated with that username or email address and then checks
        the password.

        On valid credentials, returns the associated `User` object,
        otherwise returns `None`.
        """

        try:
            validate_email(username)
        except ValidationError:
            field = 'username'
        else:
            field = 'email'

        try:
            user = User.objects.get(**{field: username})
        except User.DoesNotExist:
            pass
        else:
            if user.check_password(password):
                return user
