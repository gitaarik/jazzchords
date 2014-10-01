from django.forms import CharField
from core.helpers.init_defaulter import InitDefaulter
from .models import Song


class SongNameField(InitDefaulter, CharField):

    MAX_LENGTH = Song._meta.get_field('name').max_length

    _init_defaults = {
        'min_length': 2,
        'max_length': MAX_LENGTH
    }

    default_error_messages = {
        'required': "Please fill in the song name.",
        'max_length': (
            "A song name can at most have {} characters."
            .format(MAX_LENGTH)
        )
    }
