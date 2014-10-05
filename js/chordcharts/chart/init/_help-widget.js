var settings_el = $('.chord-chart .chart-menu .help');
var widget_el = settings_el.find('.sub-buttons');

settings_el.find('.label').click(function() {
    widget_el.toggle();
});

widget_el.find('.sub-button.delete').click(function() {

    if (confirm("Are you really sure you want to delete the chart?")) {
        $(this).find('form').submit();
    }

});

$('html').click(function(event) {

    if (widget_el.is(':visible')) {

        if (
            !$(event.target)
                .closest('.settings')
                .closest('.chart-menu')
                .closest('.chord-chart')
                .length
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
