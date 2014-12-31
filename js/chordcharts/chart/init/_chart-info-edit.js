var ChartInfoEdit = require('../models/_chart-info-edit.js');
var ChartInfoEditView = require('../views/_chart-info-edit.js');
var chart = require('./init/_chart.js');


var chartInfoEdit = new ChartInfoEdit({ chart: chart });

new ChartInfoEditView({
    el: GLOBALS.base_el_selector + ' .chart-info',
    model: chartInfoEdit
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (chartInfoEdit.get('visible')) {

        var target = $(event.target);

        // Check if the click wasn't a click to open the widget,
        // or a click inside the widget.
        if (
            !(
                target.hasClass('edit') &&
                target.closest(GLOBALS.base_el_selector + '.chart-info').length
            ) &&
            !target.closest(GLOBALS.base_el_selector + ' .chart-info-edit').length
        ) {
            // close the widget
            chartInfoEdit.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (
        chartInfoEdit.get('visible') &&
        $.inArray(event.key, ['Esc', 'Escape']) > -1
    ) {
        chartInfoEdit.set('visible', false);
    }

});

module.exports = chartInfoEdit;
