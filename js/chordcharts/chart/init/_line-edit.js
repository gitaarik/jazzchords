var LineEdit = require('../models/_line-edit.js');
var LineEditView = require('../views/_line-edit.js');
        

var lineEdit = new LineEdit();

new LineEditView({
    el: GLOBALS.base_el_selector + ' .line-edit',
    model: lineEdit
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (lineEdit.get('visible')) {

        var target = $(event.target);

        // Check if the click wasn't a click to open the widget,
        // or a click inside the widget.
        if (
            !target.closest(
                GLOBALS.base_el_selector + ' .section-sidebar-part'
            ).length &&
            !target.closest(
                GLOBALS.base_el_selector + ' .line-edit'
            ).length
        ) {
            // close the widget
            lineEdit.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (
        lineEdit.get('visible') &&
        $.inArray(event.key, ['Esc', 'Escape']) > -1
    ) {
        lineEdit.set('visible', false);
    }

});

module.exports = lineEdit;
