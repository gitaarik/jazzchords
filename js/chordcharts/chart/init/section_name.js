var SectionName = require('../models/section_name.js');
var SectionNameView = require('../views/section_name.js');


var sectionName = new SectionName();

new SectionNameView({
    el: '.chord-chart .section-name',
    model: sectionName
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (sectionName.get('visible')) {

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
                .closest('.section-name')
                .closest('.chord-chart')
                .length
        ) {
            // close the widget
            sectionName.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (sectionName.get('visible') && event.key == 'Esc') {
        sectionName.set('visible', false);
    }

});

module.exports = sectionName;
