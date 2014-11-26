var menu_el = $('.chord-chart .chart-menu');

menu_el.find('.label').click(function() {
    $(this).parent().find('.widget').toggle();
});

$('html').click(function(event) {

    var clicked_button_el = $(event.target).closest('.button').get(0);

    menu_el.find('.button').each(function() {

        if (
            !$(event.target).closest(
                GLOBALS.base_el_selector + ' .chart-menu .button'
            ).length ||
            this !== clicked_button_el
        ) {
            $(this).find('.widget').hide();
        }

    });

});

$('html').on('keyup', function(event) {

    if ($.inArray(event.key, ['Esc', 'Escape']) > -1) {

        menu_el.find('.button .widget').each(function() {

            if ($(this).is(':visible')) {
                $(this).hide();
            }

        });

    }

});
