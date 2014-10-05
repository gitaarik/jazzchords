from django.conf import settings
from django.core import validators
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.hashers import check_password, make_password

from core.helpers.lazy import LazyStr
from .managers import UserManager
from .helpers import generate_token


class User(PermissionsMixin, AbstractBaseUser):

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    validated = models.BooleanField(default=False)
    validation_token = models.CharField(max_length=50, blank=True)

    objects = UserManager()

    def __str__(self):
        return self.username

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def validate_with_token(self, validation_token):
        """
        Try to validate the user with the given `validation_token`.
        If the validation was succesful, will reset the
        `validation_token` so it can't be reused, and will return
        `True`. In case of a unsuccesful validation, returns `False`.
        """
        if validation_token == self.validation_token:
            self.validated = True
            self.reset_validation_token()
            return True
        else:
            return False

    def reset_validation_token(self):
        """
        Resets the `validation_token` field to a new validation token.
        """
        self.validation_token = generate_token()
        self.save()

    def signup(self):
        """
        Will reset the `validation_token`, save the model and send a
        validation email.
        """
        self.reset_validation_token()
        self.send_validation_email()

    def send_validation_email(self):
        """
        Will send an email to the user that he/she can use to validate
        their email address.

        When the user opens the link in the email, the user will be
        validated (e.g. the `validated` field on the user will be
        `True`.)
        """

        subject = "{} sign up".format(settings.WEBSITE_NAME)
        from_email = 'users@{}'.format(settings.DOMAIN_NAME)
        recipients = [self.email]

        message = (
            "Welcome to {}! Please click the following link to "
            "complete your registration:"
            "\n\n{}".format(
                settings.WEBSITE_NAME,
                '{}{}?email={}&validation_token={}'.format(
                    settings.WEBSITE_URL,
                    reverse('users:signup:completed'),
                    self.email,
                    self.validation_token
                )
            )
        )

        send_mail(subject, message, from_email, recipients)

    def reset_password_request(self):
        """
        Will reset the `validation_token` and send a reset password
        email.
        """
        self.reset_validation_token()
        self.send_reset_password_email()

    def send_reset_password_email(self):

        subject = "{} password reset".format(settings.WEBSITE_NAME)
        from_email = 'users@{}'.format(settings.DOMAIN_NAME)
        recipients = [self.email]

        message = (
            "You have requested to reset your {} password. Go to the "
            "following page to do so:\n\n{}"
            .format(
                settings.WEBSITE_NAME,
                '{}{}?email={}&validation_token={}'.format(
                    settings.WEBSITE_URL,
                    reverse('users:reset_password:confirm'),
                    self.email,
                    self.validation_token
                )
            )
        )

        send_mail(subject, message, from_email, recipients)

    def reset_password(self, new_password):
        """
        Resets the password for this user to the given `new_password`.
        """
        self.set_password(new_password)
        self.reset_validation_token()
