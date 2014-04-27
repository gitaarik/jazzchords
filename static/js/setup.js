// Adds the CSRF token to jQuery AJAX requests using the HTTP methods
// POST, PUT, PATCH and DELETE.
$.ajaxSetup({
    crossDomain: false, // do this only for same origin reqeusts
    beforeSend: function(xhr, settings) {
        if (['POST', 'PUT', 'PATCH', 'DELETE'].indexOf(settings.type) > -1) {
            xhr.setRequestHeader('X-CSRFToken', $.cookie('csrftoken'));
        }
    }
});
