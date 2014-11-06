window.$ = window.jQuery = require('./libs/_jquery');
window._ = window.Underscore = require('./libs/_underscore');
window.Backbone = require('./libs/_backbone');
window.Backbone.$ = $;
require('./libs/_jquery.cookie');
require('./default_widgets/_forms');
require('./default_widgets/_light-table');
require('./default_widgets/_popup-box');
require('./_search');


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

/**
 * JQuery function to put the focus on a input element and put the
 * cursor at the end of it.
 */
jQuery.fn.focusAtEnd = function() {

    return this.each(function() {

        $(this).focus();

        // If this function exists...
        if (this.setSelectionRange) {
            // ... then use it (Doesn't work in IE)
            // Double the length because Opera is inconsistent about
            // whether a carriage return is one character or two. Sigh.
            var len = $(this).val().length * 2;
            this.setSelectionRange(len, len);
        } else {
            // ... otherwise replace the contents with itself.
            // (Doesn't work in Google Chrome)
            $(this).val($(this).val());
        }

        // Scroll to the bottom, in case we're in a tall textarea
        // (Necessary for Firefox and Google Chrome)
        this.scrollTop = 999999;

    });

};
