from django.forms import CharField


class AccountPasswordField(CharField):
    """
    The Django Forms field to use for an account password.

    Because the password is stored encrypted, you can't use the password
    field on the model. Use this field instead.
    """

    MIN_LENGTH = 8
    MAX_LENGTH = 50

    default_error_messages = {
        'blank': "Please create a password.",
        'min_length': (
            "Please choose a password that's at least {} characters "
            "long.".format(MIN_LENGTH)
        ),
        'max_length': (
            "Please create a password with max {} characters."
            .format(MAX_LENGTH)
        ),
    }

    def __init__(
        self,
        *args,
        min_length=MIN_LENGTH,
        max_length=MAX_LENGTH,
        **kwargs
    ):
        super().__init__(
            *args,
            min_length=min_length,
            max_length=max_length,
            **kwargs
        )
