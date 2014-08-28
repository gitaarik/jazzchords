var SectionEdit = require('../models/section_edit.js');
var SectionEditView = require('../views/section_edit.js');


var sectionEdit = new SectionEdit();

new SectionEditView({
    el: '.chord-chart .section-edit',
    model: sectionEdit
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (sectionEdit.get('visible')) {

        var target = $(event.target);

        // Check if the click wasn't a click to open the widget,
        // or a click inside the widget.
        if (
            !(
                // click was to open the widget
                target
                    .closest('.section-header')
                    .closest('.chord-chart')
                    .length &&
                target.hasClass('name')
            ) &&
            // click was in the widget
            !target
                .closest('.section-edit')
                .closest('.chord-chart')
                .length
        ) {
            // close the widget
            sectionEdit.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (sectionEdit.get('visible') && event.key == 'Esc') {
        sectionEdit.set('visible', false);
    }

});

module.exports = sectionEdit;
