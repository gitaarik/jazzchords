from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.backends import ModelBackend
from chordcharts.models import Chart
from .models import User


class UserBackend(ModelBackend):

    def authenticate(
        self,
        username=None,
        password=None,
        validation_token=None,
        **kwargs
    ):
        """
        Authenticate using a username (which is can also be the email
        of the user) and a password or validation_token.

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

            if validation_token and user.validate_with_token(validation_token):
                return user

            if password and user.check_password(password):
                return user

    def has_perm(self, user_obj, perm, obj=None):
        """
        If `obj` is not None, it will check if the user has permission
        for this specific object by calling the `has_permission` method
        on that object if it's there. Otherwise, will do the default
        behavior
        """
        if (
            obj and hasattr(obj, 'has_permission') and
            obj.has_permission(user_obj, perm)
        ):
            return True
        else:
            return super().has_perm(user_obj, perm, obj)
