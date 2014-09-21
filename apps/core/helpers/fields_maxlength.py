def fields_maxlength(model, fields):
    """
    Given a model and a list of fieldnames, this function will return a
    dict with the fieldnames in the keys and the maximum length of the
    field in the value.

    This comes in handy when building HTML forms and you want to set the
    `maxlength` property on input fields.
    """
    return {
        field: model._meta.get_field(field).max_length
        for field in fields
    }
