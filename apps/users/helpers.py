import string
from random import choice


def generate_token():
    return ''.join([
        choice(string.ascii_letters + string.digits)
        for i in range(25)
    ])
