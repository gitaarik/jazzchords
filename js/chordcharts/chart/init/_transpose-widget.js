var TransposeWidget = require('../models/_transpose-widget.js');
var TransposeWidgetView = require('../views/_transpose-widget.js');


var transposeWidget = new TransposeWidget();

new TransposeWidgetView({
    el: $('.chord-chart .key-select'),
    model: transposeWidget
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (transposeWidget.get('visible')) {

        var target = $(event.target);

        // Check if the click wasn't a click to open the widget,
        // or a click inside the widget.
        if (
            !target
                .closest('.key-select')
                .closest('.chord-chart')
                .length &&
            !target
                .closest('.current-key')
                .closest('.open')
                .closest('.chord-chart')
                .length
        ) {
            transposeWidget.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (transposeWidget.get('visible') && event.key == 'Esc') {
        transposeWidget.set('visible', false);
    }

});

module.exports = transposeWidget;
