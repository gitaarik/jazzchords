from django.core.exceptions import ValidationError
from ..models import User


class CreateAccount():
    """
    Processes a create account request.
    """

    def __init__(self, request):

        # The Django request object that for the create account page.
        self.request = request

        # If the HTML form is submitted, this will contain a user
        # object, otherwise will remain `None`.
        self.user = None

        # If the HTML form is submitted, this will contain any errors
        # raised while validating the request. Otherwise will remain an
        # empty dict.
        self.errors = {}

        # If the HTML form is submitted, these are the fields that will
        # be read from the request's POST data and written to the new
        # user object.
        self.fields = ['username', 'password', 'email']

    def process(self):
        """
        Processes a create account request.

        Will return a boolean indicating if the request resulted in a
        successful account creation. If the account creation wasn't
        successful, the errors can be found in the `errors` property.
        """

        success = False

        if self.request.method == 'POST':

            posted_data = {
                field: self.request.POST.get(field)
                for field in self.fields
            }

            self.user = User(**posted_data)

            try:
                self.user.full_clean()
            except ValidationError as error:
                self.update_existing_unvalidated_user(error)
                self.errors = error.message_dict

            if not self.errors:

                try:
                    self.user.save()
                except ValidationError as error:
                    self.errors = error.message_dict
                else:
                    self.user.send_confirmation_email()
                    success = True

        return success

    def update_existing_unvalidated_user(self, validation_error):
        """
        If there's already a user with the same email address (and
        possibly username), but has not been validated yet, we update
        this existing user and remove the errors associated with this
        conflict.
        """

        if self.get_error(validation_error, 'email', 'unique'):

            existing_user = User.objects.get(email=self.user.email)

            if not existing_user.validated:

                for field in self.fields:
                    setattr(existing_user, field, getattr(self.user, field))

                self.user = existing_user

                self.remove_error(validation_error, 'email', 'unique')
                self.remove_error(validation_error, 'username', 'unique')

    def get_error(self, validation_error, field, error_code):
        """
        Returns the error with the given `error_code` in the given
        `validation_error` object for the given `field`, or returns
        `None` in case there is no error like this.
        """

        error_dict = validation_error.error_dict

        if field in error_dict:

            for error in error_dict[field]:

                if error.code == error_code:
                    return error

    def remove_error(self, validation_error, field, error_code):
        """
        Removes an error from the given `validation_error` object.
        """

        error_no = 0
        error_dict = validation_error.error_dict

        if field in error_dict:

            for error in error_dict[field]:

                if error.code == error_code:

                    error_dict[field].pop(error_no)

                    # Remove the field from the `error_dict` if all errors
                    # for this field are gone.
                    if len(error_dict[field]) == 0:
                        del(error_dict[field])

                error_no += 1
