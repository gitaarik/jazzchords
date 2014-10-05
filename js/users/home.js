$(function() {

    var edit_account_form_el = $('.edit-account');
    var password_view_el = edit_account_form_el.find('.password-view');
    var password_edit_el = edit_account_form_el.find('.password-edit');
    var new_password_error_el = password_edit_el.find(
        '.new-password-error'
    );
    var repeat_password_error_el = password_edit_el.find(
        '.repeat-password-error'
    );
    var updated_password_el = password_view_el.find('.password-updated');
    var new_password_input_el = password_edit_el.find('.new-password input');
    var repeat_password_input_el = password_edit_el.find('.repeat-password input');

    function showUpdatePasswordForm() {
        password_view_el.hide();
        password_edit_el.show();
        window._LightTables.reinit();
        new_password_input_el.focus();
    }

    function hideUpdatePasswordForm() {
        password_edit_el.hide();
        new_password_error_el.hide();
        repeat_password_error_el.hide();
        updated_password_el.hide();
        password_view_el.show();
        window._LightTables.reinit();
    }

    function submitUpdatePasswordForm() {

        var request_data = {
            new_password1: new_password_input_el.val(),
            new_password2: repeat_password_input_el.val(),
        };

        $.post(
            '/ajax/users/update-password/',
            request_data,
            function(response_data) {
                if (response_data.success) {
                    hideUpdatePasswordForm();
                    updated_password_el.show();
                } else {
                    showFormErrors(response_data.errors);
                    new_password_input_el.focus();
                }
            }
        );

    }

    function showFormErrors(errors) {

        if ('new_password1' in errors) {
            new_password_error_el.find('td').html(
                errors.new_password1.join('<br')
            );
            new_password_error_el.show();
        } else {
            new_password_error_el.hide();
        }

        if ('new_password2' in errors) {
            repeat_password_error_el.find('td').html(
                errors.new_password2.join('<br>')
            );
            repeat_password_error_el.show();
        } else {
            repeat_password_error_el.hide();
        }

    }

    password_view_el.find('.change a').click(function() {
        showUpdatePasswordForm();
    });

    password_edit_el.find('.buttons .cancel').click(function() {
        hideUpdatePasswordForm();
    });

    edit_account_form_el.submit(function() {
        submitUpdatePasswordForm();
        return false;
    });

});
