var SectionKey = require('../models/_section-key.js');
var SectionKeyView = require('../views/_section-key.js');


var sectionKey = new SectionKey();

new SectionKeyView({
    el: GLOBALS.base_el_selector + ' .section-key',
    model: sectionKey
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (sectionKey.get('visible')) {

        var target = $(event.target);

        // Check if the click wasn't a click to open the widget,
        // or a click inside the widget.
        if (
            !(
                // click was to open the widget
                target.closest(
                    GLOBALS.base_el_selector + ' .section-header'
                ).length &&
                target.hasClass('key')
            ) &&
            // click was in the widget
            !target.closest(
                GLOBALS.base_el_selector + ' .section-key'
            ).length
        ) {
            // close the widget
            sectionKey.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (
        sectionKey.get('visible') &&
        $.inArray(event.key, ['Esc', 'Escape']) > -1
    ) {
        sectionKey.set('visible', false);
    }

});

module.exports = sectionKey;
