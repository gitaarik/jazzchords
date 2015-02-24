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

$('html').click(function(event) {

    var clicked_popupbox_opener = (
        $(event.target).closest('._popup-box-opener').get(0)
    );

    $('._popup-box-opener').each(function() {

        if (this !== clicked_popupbox_opener) {
            $(this).find('._popup-box').hide().trigger('hide');
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
