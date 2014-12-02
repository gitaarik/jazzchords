from django.db import IntegrityError
from django.core.urlresolvers import reverse
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.contrib.auth import authenticate
from django.forms import Form, ModelForm
from django.forms import fields as django_fields

from core.helpers.lazy import LazyStr
from .models import User
from . import fields


class SignUpForm(ModelForm):

    username = fields.UsernameField(
        error_messages={
            'required': "Please create a username.",
            'min_length': (
                "A username should at least contain {} characters."
                .format(fields.UsernameField.MIN_LENGTH)
            ),
            'max_length': (
                "A username can at most have {} characters."
                .format(fields.UsernameField.MAX_LENGTH)
            ),
            'username_is_email': (
                "Please don't use an email address as a username"
            )
        }
    )

    password1 = fields.PasswordField(
        error_messages={
            'required': "Please create a password.",
            'min_length': (
                "Please choose a password that's at least {} characters "
                "long.".format(fields.PasswordField.MIN_LENGTH)
            ),
            'max_length': (
                "Please create a password with max {} characters."
                .format(fields.PasswordField.MAX_LENGTH)
            ),
        }
    )

    password2 = fields.PasswordField(
        error_messages={
            'required': "Please repeat the password.",
            'min_length': "",
            'max_length': "",
        }
    )

    email = fields.EmailField(
        error_messages={
            'required': (
                "Please fill in your email address. We use it to "
                "reset your password in case you lost it."
            ),
            'max_length': (
                "An email address can at most have {} characters."
                .format(fields.EmailField.MAX_LENGTH)
            ),
            'invalid': "Sorry but this email address is not valid.",
        }
    )

    class Meta:
        model = User
        fields = ['username', 'email']

    def signup(self):
        """
        Creates the user model, calls `signup()` on it and returns
        it, or returns `False` in case of failure.
        """

        user = self.save(commit=False)

        try:
            user.signup()
        except IntegrityError as error:
            self.add_error(
                None,
                ValidationError(
                    "Sorry, there was a technical error. Please try "
                    "again.",
                    'integrity'
                )
            )
            return False
        else:
            return user

    def save(self, *args, **kwargs):
        """
        Because `password` isn't a native field on the model, it doesn't
        get set by the default functionality of `ModelForm`. So we're
        explicitly setting it here.
        """

        commit = kwargs['commit']
        kwargs['commit'] = False

        model = super().save(*args, **kwargs)
        model.set_password(self.data['password1'])

        if commit:
            model.save()

        return model

    def clean_username(self):

        username = self.cleaned_data.get('username')

        if User.objects.filter(username=username).exists():
            raise ValidationError(
                "This username is already taken. If you forgot your "
                "password, you can <a href=\"{}\">reset it over "
                "here</a>.".format(reverse('users:reset_password:request')),
                'unique'
            )

        return username

    def clean_email(self):

        email = self.cleaned_data.get('email')

        if User.objects.filter(email=email).exists():
            raise ValidationError(
                "There's already a user that uses this email address. If "
                "you forgot your password, you can <a href=\"{}\">reset it "
                "over here</a>.".format(
                    reverse('users:reset_password:request')
                ),
                'unique'
            )

        return email

    def clean(self, *args, **kwargs):

        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')

        if self.data['password2'] and password1 != password2:
            raise ValidationError(
                "The passwords didn't match. Please try again.",
                'passwords_dont_match'
            )


class ResetPasswordRequestForm(Form):

    email = fields.EmailField(
        error_messages={
            'required': "Please fill in your email address.",
            'max_length': (
                "An email address can at most have {} characters."
                .format(fields.EmailField.MAX_LENGTH)
            ),
            'invalid': "Sorry but this email address is not valid.",
        }
    )

    def reset_password_request(self):
        """
        If there was an user matching the given email address, it will
        call `reset_password_request()` on that user object and returns
        that user. Otherwise, returns `False`.
        """
        if self.is_valid():
            self.user.reset_password_request()
            return self.user
        else:
            return False

    def clean_email(self, *args, **kwargs):
        try:
            self.user = User.objects.get(
                email=self.cleaned_data['email']
            )
        except ObjectDoesNotExist:
            raise ValidationError(
                message="Sorry, but this email address is unkown to us.",
                code='user_not_found'
            )
        else:
            return self.cleaned_data['email']


class ResetPasswordConfirmForm(Form):

    new_password1 = fields.PasswordField(error_messages={
        'required': "Please fill in your new password.",
        'min_length': (
            "Please choose a password that's at least {} characters "
            "long.".format(fields.PasswordField.MIN_LENGTH)
        ),
        'max_length': (
            "Please create a password with max {} characters."
            .format(fields.PasswordField.MAX_LENGTH)
        )
    })

    new_password2 = fields.PasswordField(error_messages={
        'required': "Please repeat your password.",
        'min_length': "",
        'max_length': ""
    })

    def __init__(self, data, user):
        self.user = user
        super().__init__(data)

    def reset_password(self):
        """
        If the form was valid, resets the password for the user and
        returns `True`, otherwise returns `False`.
        """
        if self.is_valid():
            self.user.reset_password(self.cleaned_data['new_password1'])
            return True
        else:
            return False

    def clean(self):

        new_password1 = self.cleaned_data.get('new_password1')
        new_password2 = self.cleaned_data.get('new_password2')

        if self.data.get('new_password2') and new_password1 != new_password2:
            raise ValidationError(
                "The passwords didn't match. Please try again.",
                'passwords_mismatch'
            )


class LoginForm(Form):

    user = None

    username_email = django_fields.CharField(
        error_messages={
            'required': "Please fill in your username or email address."
        }
    )

    password = django_fields.CharField(
        error_messages={
            'required': "Please fill in your password.",
        }
    )

    def clean_username_email(self):

        value = self.cleaned_data['username_email']

        try:
            fields.EmailField().clean(value)
        except ValidationError:
            field = 'username'
        else:
            field = 'email'

        try:
            self.user = User.objects.get(**{field: value})
        except ObjectDoesNotExist:
            raise ValidationError(
                "Sorry, the login failed. Please try again.",
                'login_failed'
            )

    def clean(self):

        password = self.cleaned_data.get('password')

        if self.user and password:

            self.user = authenticate(
                username=self.user.username,
                password=password
            )

            if not self.user:
                raise ValidationError(
                    "Sorry, the login failed. Please try again.",
                    'login_failed'
                )
            elif not self.user.validated:
                raise ValidationError(
                    "The email address of this account has not been "
                    'validated yet. Please <a href="{}?email={}">'
                    "validate your email address</a>.".format(
                        reverse('users:signup:resend_validation_email'),
                        self.user.email
                    ),
                    'not_validated'
                )

    def get_user(self):
        return self.user


class UpdatePasswordForm(Form):

    new_password1 = fields.PasswordField(
        error_messages={
            'required': "Please fill in your new password.",
            'min_length': (
                "Please choose a password that's at least {} characters "
                "long.".format(fields.PasswordField.MIN_LENGTH)
            ),
            'max_length': (
                "Please create a password with max {} characters."
                .format(fields.PasswordField.MAX_LENGTH)
            ),
        }
    )

    new_password2 = fields.PasswordField(
        error_messages={
            'required': "Please repeat your new password.",
            'min_length': "",
            'max_length': "",
        }
    )

    def clean(self):

        new_password1 = self.cleaned_data.get('new_password1')
        new_password2 = self.cleaned_data.get('new_password2')

        if self.data.get('new_password2') and new_password1 != new_password2:
            raise ValidationError(
                "The passwords didn't match. Please try again.",
                'passwords_mismatch'
            )
