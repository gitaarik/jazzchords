var Lines = require('../collections/_lines.js');
var allKeys = require('../../../core/widgets/_all-keys.js');


module.exports = Backbone.Model.extend({

    initialize: function() {
        this.initData();
        this.initListeners();
    },

    initData: function() {

        // Only set lines if it hasn't been set yet. Prevents errors
        // when cloning.
        if (!(this.get('lines') instanceof Backbone.Collection)) {

            var that = this;
            var lines = new Lines();
            lines.url = this.linesUrl();

            _.each(this.get('lines'), function(line_data) {
                line_data.section = that;
                lines.add(line_data);
            });

            this.set('lines', lines);

        }

        if (!(this.get('key') instanceof Backbone.Model)) {

            this.set(
                'key',
                allKeys.findWhere({
                    id: this.get('key_id')
                })
            );

        }

    },

    linesUrl: function() {
        return this.url() + '/lines';
    },

    initListeners: function() {
        this.stopListening();
    },

    /**
     * Returns the on-screen height of this section.
     */
    height: function() {
        return (
            this.get('lines').length *
            (
                GLOBALS.settings.box_height +
                GLOBALS.settings.border_width
            )
        ) + GLOBALS.settings.border_width;
    },

    /**
     * Updates the section to the given `key` without transposing the
     * chords.
     */
    updateKey: function(key) {

        var difference = (
            this.get('key').get('distance_from_c') -
            key.get('distance_from_c')
        );

        this.set('key', key);

        this.get('lines').each(function(line) {
            line.get('measures').each(function(measure) {
                measure.get('chords').each(function(chord) {

                    chord.set(
                        'chord_pitch',
                        (chord.get('chord_pitch') + difference + 12) % 12
                    );

                    chord.set(
                        'alt_bass_pitch',
                        (chord.get('alt_bass_pitch') + difference + 12) % 12
                    );

                });
            });
        });

    },

    copy: function(attributes) {

        var copy = this.clone();
        copy.set({
            id: null,
            lines: this.get('lines').copy({ section: copy })
        });

        if (attributes) {
            copy.set(attributes);
        }

        copy.initListeners();

        return copy;

    },

    /**
     * Recursively saves this section and it's children (lines,
     * measures and chords).
     */
    saveRecursive: function() {

        var that = this;

        this.save(null, { success: function() {
            that.get('lines').url = that.linesUrl();
            that.get('lines').each(function(line) {
                line.saveRecursive();
            });
        }});

    },

    toJSON: function() {
        return {
            number: this.get('number'),
            key_id: this.get('key').get('id'),
            name: this.get('name'),
            time_signature: this.get('time_signature'),
            show_sidebar: this.get('show_sidebar')
        };
    }

});
