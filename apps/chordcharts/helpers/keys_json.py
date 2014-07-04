import json


def keys_json(keys):
    """
    Returns the JSON representation of the given `keys`.
    """
    return json.dumps([key.client_data() for key in keys])
