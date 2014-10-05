from django.http.response import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError

from core.helpers.form_errors import copy_global_error, remove_empty_errors
from .forms import UpdatePasswordForm


@require_POST
@login_required
def update_password(request):

    update_password_form = UpdatePasswordForm(request.POST)

    if update_password_form.is_valid():
        success = True
        errors = {}
        request.user.set_password(
            update_password_form.cleaned_data['new_password1']
        )
        request.user.save()
    else:
        success = False
        copy_global_error(
            update_password_form,
            'passwords_mismatch',
            'new_password1'
        )
        remove_empty_errors(update_password_form)
        errors = update_password_form.errors

    return JsonResponse({
        'success': success,
        'errors': errors
    })
