var help_button = $('.chord-chart .chart-edit-buttons .button.help');
var widget_el = $('.chord-chart .help-widget');

help_button.click(function() {
    widget_el.show();
});

$('html').click(function(event) {

    if (widget_el.is(':visible')) {

        var target = $(event.target);

        if (
            !target
                .closest('.help-widget')
                .closest('.chord-chart')
                .length &&
            !(
                target
                    .closest('.chart-edit-buttons')
                    .closest('.chord-chart')
                    .length &&
                target.hasClass('help')
            )
                
        ) {
            widget_el.hide();
        }

    }

});

$('html').on('keyup', function(event) {

    if (widget_el.is(':visible') && event.key == 'Esc') {
        widget_el.hide();
    }

});
