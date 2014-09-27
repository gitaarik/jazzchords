from django.core.urlresolvers import reverse
from django.forms import ModelForm, CharField, EmailField
from core.helpers.lazy import LazyStr
from ..models import Account
from ..fields import AccountPasswordField


class CreateAccountForm(ModelForm):

    username = CharField(
        min_length=2,
        error_messages={
            'required': "Please choose a username.",
            'max_length': "A username can at most have 50 characters.",
            'unique': "Sorry, this username is already taken."
        }
    )

    password = AccountPasswordField(
        min_length=8,
        error_messages={
            'required': "Please create a password.",
            'min_length': (
                "Please choose a password that's at least 8 characters "
                "long."
            ),
            'max_length': (
                "Please create a password with max 50 characters."
            )
        }
    )

    email = EmailField(
        error_messages={
            'required': (
                "Please fill in your email address. We use it to "
                "reset your password in case you lost it."
            ),
            'max_length': (
                "An email address can at most have 254 characters."
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
    )

    class Meta:
        model = Account
        fields = ['username', 'email']

    def create(self):
        """
        Creates the account model, calls `create()` on it and returns
        it.
        """
        account = self.save(commit=False)
        account.create()
        return account

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
