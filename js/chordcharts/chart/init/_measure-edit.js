var MeasureEdit = require('../models/_measure-edit.js');
var MeasureEditView = require('../views/_measure-edit.js');


var measureEdit = new MeasureEdit();

new MeasureEditView({
    el: GLOBALS.base_el_selector + ' .measure-edit',
    model: measureEdit
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (measureEdit.get('visible')) {

        var target = $(event.target);

        if (
            // Check if the click wasn't a click to open the widget,
            // or a click inside the widget.
            (
                !target.closest(
                    GLOBALS.base_el_selector + ' .measure-edit'
                ).length &&
                !target.closest(
                    GLOBALS.base_el_selector + ' .measure'
                ).length
            ) ||
            // Or the click was on a chord (which is also inside
            // a measure).
            target.closest(
                GLOBALS.base_el_selector + ' .chord .chord-name'
            ).length
        ) {
            // close the widget
            measureEdit.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (
        measureEdit.get('visible') &&
        $.inArray(event.key, ['Esc', 'Escape']) > -1
    ) {
        measureEdit.set('visible', false);
    }

});

module.exports = measureEdit;
