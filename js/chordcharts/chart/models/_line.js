var Model = require('../init/_model.js');
var Measures = require('../collections/_measures.js');


module.exports = Model.extend({

    initialize: function() {

        // Only set measures if it hasn't been set yet. Prevents errors
        // when cloning.
        if (!(this.get('measures') instanceof Backbone.Collection)) {

            var that = this;
            var measures = new Measures();
            measures.url = this.measuresUrl();

            _.each(this.get('measures'), function(measure_data) {
                measure_data.line = that;
                measures.add(measure_data);
            });

            measures.initPrevNextMeasures();

            this.set('measures', measures);

        }

        this.initListeners();

    },

    measuresUrl: function() {
        return this.url() + '/measures';
    },

    initListeners: function() {
        this.stopListening();
        this.listenTo(this.get('measures'), 'remove', this.measureRemoved);
    },

    getKey: function() {
        return this.get('section').get('key');
    },

    previous: function() {
        return this.getSibling(-1);
    },

    next: function() {
        return this.getSibling(1);
    },

    /**
     * Returns the sibling line in the collection that is
     * `difference` away from this line, where a negative
     * `difference` will return a previous sibling and a
     * positive `difference` an upcoming sibling.
     */
    getSibling: function(difference) {
        return this.collection.findWhere({
            number: this.get('number') + difference
        });
    },

    measureRemoved: function() {
        if (!this.get('measures').length) {
            this.destroy();
        }
    },

    copy: function(attributes) {

        var copy = this.clone();
        copy.set({
            id: null,
            measures: this.get('measures').copy({ line: copy })
        });

        if (attributes) {
            copy.set(attributes);
        }

        copy.initListeners();

        return copy;

    },

    /**
     * Recursively saves this line and it's children (measures
     * and chords).
     */
    saveRecursive: function() {

        var that = this;

        this.save(null, { success: function() {
            that.get('measures').url = that.measuresUrl();
            that.get('measures').each(function(measure) {
                measure.saveRecursive();
            });
        }});

    },

    toJSON: function() {
        return {
            number: this.get('number'),
            letter: this.get('letter'),
            merge_with_next_line: this.get('merge_with_next_line')
        };
    }

});
