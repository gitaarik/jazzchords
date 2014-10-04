from django.core.urlresolvers import reverse
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.urlresolvers import reverse
from django.forms import Form, ModelForm

from .models import User
from .fields import UsernameField, PasswordField, EmailField


class SignUpForm(ModelForm):

    username = UsernameField()
    password = PasswordField()
    email = EmailField()

    class Meta:
        model = User
        fields = ['username', 'email']

    def signup(self):
        """
        Creates the user model, calls `signup()` on it and returns
        it.
        """
        user = self.save(commit=False)
        user.signup()
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
        model.password = self.data['password']

        if commit:
            model.save()

        return model


class ResetPasswordRequestForm(Form):

    email = EmailField(
        error_messages={
            'required': "Please fill in your email address."
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
                message=(
                    "There is no user with this email address. You "
                    "can <a href=\"{}\">create<a> it if you like."
                    .format(reverse('users:create:create'))
                ),
                code='user_not_found'
            )
        else:
            return self.cleaned_data['email']


class ResetPasswordConfirmForm(Form):

    new_password1 = PasswordField(error_messages={
        'required': "Please fill in your new password.",
    })

    new_password2 = PasswordField(error_messages={
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

    def clean(self, *args, **kwargs):

        new_password1 = self.cleaned_data.get('new_password1')
        new_password2 = self.cleaned_data.get('new_password2')

        if self.data['new_password2'] and new_password1 != new_password2:
            raise ValidationError(
                "The passwords didn't match. Please try it again.",
                'passwords_dont_match'
            )
