$('._popup-box-opener').click(function(event) {

    if (!$(event.target).closest('._popup-box').length) {
        $(this).find('._popup-box').toggle();
    }

});

$('html').click(function(event) {

    var clicked_popupbox_opener = (
        $(event.target).closest('._popup-box-opener').get(0)
    );

    $('._popup-box-opener').each(function() {

        if (this !== clicked_popupbox_opener) {
            $(this).find('._popup-box').hide();
        }

    });

});

$('html').on('keyup', function(event) {

    if ($.inArray(event.key, ['Esc', 'Escape']) > -1) {

        $('._popup-box-opener ._popup-box').each(function() {

            if ($(this).is(':visible')) {
                $(this).hide();
            }

        });

    }

});

