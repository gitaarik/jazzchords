from django.forms import CharField, EmailField as DjangoEmailField
from core.helpers.init_defaulter import InitDefaulter
from .models import User
from . import validators


class UsernameField(InitDefaulter, CharField):

    MIN_LENGTH = 2
    MAX_LENGTH = User._meta.get_field('username').max_length

    _init_defaults = {
        'min_length': MIN_LENGTH,
        'max_length': MAX_LENGTH,
        'validators': [validators.validate_username]
    }


class PasswordField(InitDefaulter, CharField):
    """
    The Django Forms field to use for a user password.

    Because the password is stored encrypted, you can't use the password
    field on the model. Use this field instead.
    """

    MIN_LENGTH = 8
    MAX_LENGTH = 50

    _init_defaults = {
        'min_length': MIN_LENGTH,
        'max_length': MAX_LENGTH
    }


class EmailField(InitDefaulter, DjangoEmailField):

    MAX_LENGTH = User._meta.get_field('email').max_length

    _init_defaults = {
        'max_length': MAX_LENGTH
    }
