from django.forms import CharField, EmailField as DjangoEmailField
from core.helpers.init_defaulter import InitDefaulter
from core.helpers.lazy import LazyStr
from .models import Account


class UsernameField(InitDefaulter, CharField):

    MIN_LENGTH = 2
    MAX_LENGTH = Account._meta.get_field('username').max_length

    _init_defaults = {
        'min_length': MIN_LENGTH,
        'max_length': MAX_LENGTH
    }

    default_error_messages = {
        'required': "Please create a username.",
        'min_length': (
            "A username should at least contain {} characters."
            .format(MIN_LENGTH)
        ),
        'max_length': (
            "A username can at most have {} characters."
            .format(MAX_LENGTH)
        ),
        'unique': "Sorry, this username is already taken."
    }


class PasswordField(InitDefaulter, CharField):
    """
    The Django Forms field to use for an account password.

    Because the password is stored encrypted, you can't use the password
    field on the model. Use this field instead.
    """

    MIN_LENGTH = 8
    MAX_LENGTH = 50

    _init_defaults = {
        'min_length': MIN_LENGTH,
        'max_length': MAX_LENGTH
    }

    default_error_messages = {
        'required': "Please create a password.",
        'min_length': (
            "Please choose a password that's at least {} characters "
            "long.".format(MIN_LENGTH)
        ),
        'max_length': (
            "Please create a password with max {} characters."
            .format(MAX_LENGTH)
        ),
    }


class EmailField(InitDefaulter, DjangoEmailField):

    MAX_LENGTH = Account._meta.get_field('email').max_length

    _init_defaults = {
        'max_length': MAX_LENGTH
    }

    default_error_messages = {
        'required': (
            "Please fill in your email address. We use it to "
            "reset your password in case you lost it."
        ),
        'max_length': (
            "An email address can at most have {} characters."
            .format(MAX_LENGTH)
        ),
        'invalid': "Sorry but this email address is not valid.",
        'unique': LazyStr(lambda: (
            "There's already an account that uses this email "
            "address. If you forgot your password, you can <a "
            "href=\"{}\">reset it over here</a>.".format(
                reverse('accounts:reset_password:request')
            )
        ))
    }
