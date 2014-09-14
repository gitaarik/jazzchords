var menu_el = $('.chord-chart .chart-menu');

menu_el.find('.label').click(function() {
    $(this).parent().find('.widget').toggle();
});

$('html').click(function(event) {

    var clicked_button_el = $(event.target).closest('.button').get(0);

    menu_el.find('.button').each(function() {

        if (
            !$(event.target)
                .closest('.button')
                .closest('.chart-menu')
                .closest('.chord-chart')
                .length ||
            this !== clicked_button_el
        ) {
            $(this).find('.widget').hide();
        }

    });

});

$('html').on('keyup', function(event) {

    if (event.key == 'Esc') {

        menu_el.find('.button .widget').each(function() {

            if ($(this).is(':visible')) {
                $(this).hide();
            }

        });

    }

});
