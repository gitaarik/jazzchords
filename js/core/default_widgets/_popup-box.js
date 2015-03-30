$('._popup-box-opener').click(function(event) {

    var target = $(event.target);

    if (!(
        target.prop('tagName') == 'A' ||
        target.closest('._popup-box').length
    )) {

        var popup_box = $(this).find('._popup-box');

        if (popup_box.is(':visible')) {
            popup_box.hide().trigger('hide');
        } else {
            popup_box.show().trigger('show');
        }

    }

});

$('._popup-box ._close').click(function() {
    $(this).closest('._popup-box').hide().trigger('hide');
});

$('html').click(function(event) {

    var clickedElement = $(event.target);

    var clicked_popupbox_opener = (
        clickedElement.closest('._popup-box-opener').get(0)
    );

    $('._popup-box-opener').each(function() {

        // If the clicked element isn't the popup box opener, and not a form
        // input error, then hide it if it's visible.
        if (
            this !== clicked_popupbox_opener &&
            clickedElement.closest('._form-input-error').length == 0
        ) {

            var popBox = $(this).find('._popup-box');

            if (popBox.is(':visible')) {
                popBox.hide().trigger('hide');
            }

        }

    });

});

$('html').on('keyup', function(event) {

    if ($.inArray(event.key, ['Esc', 'Escape']) > -1) {

        $('._popup-box-opener ._popup-box').each(function() {

            if ($(this).is(':visible')) {
                $(this).hide().trigger('hide');
            }

        });

    }

});
