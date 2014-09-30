from django.forms import ChoiceField
from core.helpers.init_defaulter import InitDefaulter
from .models import Key


class KeyTonicField(InitDefaulter, ChoiceField):

    CHOICES = Key._meta.get_field('tonic').choices

    _init_defaults = {
        'choices': CHOICES
    }

    default_error_messages = {
        'required': "Please fill in the key tonic."
    }


class KeyTonalityField(InitDefaulter, ChoiceField):

    CHOICES = Key._meta.get_field('tonality').choices

    _init_defaults = {
        'choices': CHOICES
    }

    default_error_messages = {
        'required': "Please fill in the key tonality."
    }
