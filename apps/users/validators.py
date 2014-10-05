from django.core.validators import validate_email
from django.core.exceptions import ValidationError


def validate_username(username):
    """
    Raises a `ValidationError` if the given `username` isn't valid.
    """

    try:
        validate_email(username)
    except ValidationError:
        pass
    else:
        raise ValidationError(
            "The username can't be an email address.",
            'username_is_email'
        )

    if username.strip() != username:
        raise ValidationError(
            "The username can't start or end with spaces or tabs",
            'whitespace'
        )
