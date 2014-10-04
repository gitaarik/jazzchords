import string
from random import choice

from django.conf import settings
from django.core import validators
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.db import models
from django.contrib.auth.hashers import check_password, make_password

from core.helpers.lazy import LazyStr


class User(models.Model):

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    password_encoded = models.CharField(max_length=128)
    validated = models.BooleanField(default=False)
    validation_token = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.username

    @property
    def password(self):
        return self.password_encoded

    @password.setter
    def password(self, raw_password):
        self.password_encoded = make_password(raw_password)

    def check_password(self, raw_password):
        """
        Returns a boolean of whether the raw_password was correct. Handles
        hashing formats behind the scenes.
        """
        def setter(raw_password):
            self.set_password(raw_password)
            self.save(update_fields=['password'])
        return check_password(raw_password, self.password, setter)

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
        self.validation_token = ''.join([
            choice(string.ascii_letters + string.digits)
            for i in range(25)
        ])
        self.save()

    def signup(self):
        """
        Will reset the `validation_token`, save the model and send a
        confirmation email.
        """
        self.reset_validation_token()
        self.send_confirmation_email()

    def send_confirmation_email(self):

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
        self.password = new_password
        self.reset_validation_token()
