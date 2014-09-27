from django.core.exceptions import ValidationError
from ..models import Account
from ..forms.create_account import CreateAccountForm


class CreateAccount():
    """
    Processes a create account request.
    """

    def __init__(self, request):

        # The Django request object that for the create account page.
        self.request = request

        # If the HTML form is submitted, this will contain the
        # `CreateAccountForm` object that's used to process the form.
        # Otherwise will remain `None`.
        self.create_account_form = None

        # If the `CreateAccountForm` was successfully saved, this will
        # contain the `Account` object that was created.
        self.account = None

        # If the HTML form is submitted, this will contain any errors
        # raised while validating the request. Otherwise will remain an
        # empty dict.
        self.errors = {}

    def process(self):
        """
        Processes a create account request.

        Will return a boolean indicating if the request resulted in a
        successful account creation. If the account creation wasn't
        successful, the errors can be found in the `errors` property.
        """

        success = False

        if self.request.method == 'POST':

            self.create_account_form = CreateAccountForm(self.request.POST)

            if not self.create_account_form.is_valid():
                #self.update_existing_unvalidated_account(error)
                self.errors = self.create_account_form.errors

            if not self.errors:

                try:
                    self.account = self.create_account_form.create()
                except ValidationError as error:
                    self.errors = error.message_dict
                else:
                    success = True

        return success

    def update_existing_unvalidated_account(self, validation_error):
        """
        If there's already an account with the same email address (and
        possibly username), but has not been validated yet, we update
        this existing account and remove the errors associated with this
        conflict.
        """

        if self.get_error(validation_error, 'email', 'unique'):

            existing_account = Account.objects.get(email=self.account.email)

            if not existing_account.validated:

                for field in self.fields:
                    setattr(existing_account, field, getattr(self.account, field))

                self.account = existing_account

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
