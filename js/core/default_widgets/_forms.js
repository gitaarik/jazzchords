$(function() {

    // Adds the CSS class `_text-input-invalid` to required input
    // elements of forms that were attempted to be submitted.
    $('form').each(function() {

        var form = $(this);

        form.find('input[type=submit]').click(function(event) {

            form.addClass('_submit-attempted').attr('novalidate', 1);

            form.find('input').each(function() {

                var inputEl = $(this);
                var errorMessage;

                if(!inputEl.get(0).checkValidity()) {

                    var errorMessage = inputEl.data('validity-error');

                    if (!errorMessage) {

                        switch (inputEl.attr('type')) {

                            case 'url':
                                errorMessage = "Please enter a valid URL";
                                break;

                            default:
                                errorMessage = "Please enter a valid value";
                                break;

                        }

                    }

                    inputEl.formInputError(errorMessage);
                    event.preventDefault();

                }

            });

        });

    });

});

(function() {

    var zIndex = 500;

    jQuery.fn.formInputError = function(errorMessage) {

        return this.each(function() {

            var inputEl = $(this);
            var errorPopup = $(
                '<div class="_form-input-error _popup-box" style="z-index: ' + zIndex-- + ';">' +
                    '<div class="_arrow-up"></div>' +
                    errorMessage +
                '</div>'
            );

            inputEl.addClass('_invalid');

            $('body').append(errorPopup);

            errorPopup.css({
                'top': inputEl.offset().top + inputEl.outerHeight() + 5,
                'left': inputEl.offset().left
            }).show();

            // Remove the input error when there's a click or a keyup, but only
            // do this half a second after the popup is created because it
            // could be the click or keyup event that triggered opening the
            // input error, or a keyupevent could be just after a Enter key
            // (because when you're fast typing you might release a letter
            // later than the enter key). Half a second seems to have the best
            // experience.
            setTimeout(function() {
                $('html').on('click keyup', function(event) {
                    errorPopup.remove();
                });
            }, 500);

        });

    };

})();
