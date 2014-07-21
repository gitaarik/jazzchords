var MeasureEdit = require('../models/measure_edit.js');
var MeasureEditView = require('../views/measure_edit.js');


var measureEdit = new MeasureEdit();

new MeasureEditView({
    el: '.chord-chart .measure-edit',
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
                !target
                    .closest('.measure-edit')
                    .closest('.chord-chart')
                    .length &&
                !target
                    .closest('.measure')
                    .closest('.chord-chart')
                    .length
            ) ||
            // Or the click was on a chord (which is also inside
            // a measure).
            target
                .closest('.chord-name')
                .closest('.chord')
                .closest('.chord-chart')
                .length
        ) {
            // close the widget
            measureEdit.set('visible', false);
        }

    }

});

module.exports = measureEdit;
