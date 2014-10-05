var Section = require('../models/_section.js');


module.exports = Backbone.Collection.extend({

    model: Section,

    comparator: 'number',

    /**
     * Resets the numbers on the sections.
     *
     * Will take the current order of the sections and reset the
     * `number` field, starting with 1 and counting up.
     */
    resetNumbers: function() {

        var number = 1;

        this.each(function(section) {
            section.set('number', number++);
            section.save();
        });

    }

});
