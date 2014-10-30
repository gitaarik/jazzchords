var ChordEdit = require('../models/_chord-edit.js');
var ChordEditView = require('../views/_chord-edit.js');


var chordEdit = new ChordEdit();

new ChordEditView({
    el: GLOBALS.base_el_selector + ' .chord-edit',
    model: chordEdit
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (chordEdit.get('visible')) {

        var target = $(event.target);

        // Check if the click wasn't a click to open the widget,
        // or a click inside the widget.
        if (
            !(
                target.hasClass('chord-name') &&
                target.closest(GLOBALS.base_el_selector).length
            ) &&
            !target.closest(GLOBALS.base_el_selector + ' .chord-edit').length
        ) {
            // close the widget
            chordEdit.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (chordEdit.get('visible') && event.key == 'Esc') {
        chordEdit.set('visible', false);
    }

});

module.exports = chordEdit;
