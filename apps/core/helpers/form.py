def field_info(form, validate=False):

    context = {}

    for name, field in form.fields.items():

        context[name] = {
            'max_length': field.max_length,
            'value': '',
            'errors': []
        }

    if validate:

        for field, errors in form.errors.items():
            if field in context:
                context[field]['errors'] = errors

        for field, value in form.data.items():
            if field in context:
                context[field]['value'] = value

    return context


def copy_global_error(django_form, code, destination_field):
    """
    Copies a global form error to a field error, if it exists.
    """
    error = get_form_error(django_form, '__all__', code)
    if error:
        django_form.add_error(destination_field, error)


def get_form_error(django_form, field_name, code):
    """
    Returns the error in the given `django_form` for the given
    `field_name` and `code` or `None` if there is no error of this type.
    """
    if field_name in django_form.errors:
        for error in django_form.errors[field_name].as_data():
            if error.code == code:
                return error


def remove_empty_errors(django_form):
    """
    Removes empty errors from the given `django_form` object.

    This is handy if you want to disable errors for certain fields. You
    can override the error message to an empty one, then pass the form
    to this function and the errors will be removed.
    """

    for field in list(django_form.errors):

        for i, error in enumerate(django_form.errors[field]):
            if not error:
                del(django_form.errors[field][i])

        if not len(django_form.errors[field]):
            del(django_form.errors[field])
