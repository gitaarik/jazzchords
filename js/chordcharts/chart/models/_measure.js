var Chords = require('../collections/_chords.js');


module.exports = Backbone.Model.extend({

    initialize: function() {
        this.initData();
        this.initListeners();
    },

    initData: function() {

        // Only set chords if it hasn't been set yet. Prevents errors
        // when cloning.
        if (!(this.get('chords') instanceof Backbone.Collection)) {

            var that = this;
            var chords = new Chords();
            chords.url = this.chordsUrl();

            _.each(this.get('chords'), function(chord_data) {
                chord_data.measure = that;
                chords.push(chord_data);
            });

            this.set('chords', chords);

        }

    },

    getKey: function() {
        return this.get('line').getKey();
    },

    chordsUrl: function() {
        return this.url() + '/chords';
    },

    initListeners: function() {
        this.stopListening();
        this.listenTo(this, 'change', this.change);
    },

    change: function() {

        if (this.hasChanged('beat_schema')) {
            this.updateBeatSchema();
            this.renderNextMeasure();
        }

        // If the number of this measure changed, then set the number
        // of the next measure to this one + 1 (which will go on as
        // long as there's a next measure).
        if (this.hasChanged('number')) {

            if (this.has('next_measure')) {
                this.get('next_measure').set(
                    'number', this.get('number') + 1
                );
            }

        }

    },

    updateBeatSchema: function() {
        // Changes the beatschema to given value and reset's the chords
        // according to the current beat_schema.
        //
        // It will set the chords' correct beats and will remove
        // overflowing chords or add missing chords.

        var that = this;
        var beats_set = this.get('beat_schema').split('-');
        var last_chord;
        var new_chord = false;
        var new_chords = [];
        var new_chord_views = [];

        _.each(beats_set, function(beats, index) {

            var chord = that.get('chords').at(index);

            if (!chord) {
                chord = last_chord.copy();
                new_chord = true;
            } else {
                new_chord = false;
            }

            chord.set({
                beats: parseInt(beats),
                number: index + 1
            });

            if (new_chord) {
                new_chords.push(chord);
            }

            last_chord = chord;

        });

        if (new_chords.length) {
            this.get('chords').add(new_chords);
        }

    },

    renderNextMeasure: function() {

        if (
            this.has('next_measure') &&
            this.get('next_measure').get('beat_schema') == "4"
        ) {
            // Trigger the `render()` by setting timestamp in
            // milliseconds in `changed` attribute. Then `render()`
            // will show or remove the repeat sign ( % ).
            this.get('next_measure').get('chords').first()
                .set('changed', new Date().getTime());
        }

    },

    remove: function() {

        var prev_measure = this.get('prev_measure');
        var next_measure = this.get('next_measure');

        if (prev_measure) {

            if (next_measure) {
                next_measure.set({
                    'prev_measure': prev_measure,
                    'number': this.get('number')
                });
                prev_measure.set('next_measure', next_measure);
            } else {
                prev_measure.unset('next_measure');
            }

        } else if (next_measure) {
            next_measure.unset('prev_measure');
        }

        this.destroy();

    },

    copy: function(attributes) {

        var copy = this.clone();
        copy.set({
            id: null,
            chords: this.get('chords').copy({ measure: copy })
        });

        if (attributes) {
            copy.set(attributes);
        }

        copy.initListeners();

        return copy;

    },

    /**
     * Recursively saves this measure and it's children (chords).
     */
    saveRecursive: function() {

        var that = this;

        this.save(null, { success: function() {
            that.get('chords').url = that.chordsUrl();
            that.get('chords').each(function(chord) {
                chord.save();
            });
        }});

    },

    toJSON: function() {
        return {
            number: this.get('number'),
            beat_schema: this.get('beat_schema')
        };
    }

});
