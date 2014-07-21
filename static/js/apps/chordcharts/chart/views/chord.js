var Chord = require('../models/chord.js');
var chordEdit = require('../init/chord_edit.js');


module.exports = Backbone.View.extend({

    model: Chord,
    className: 'chord',

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click .chord-name': 'openChordEdit'
    },

    /**
     * Opens the edit widget for this chord
     */
    openChordEdit: function() {

        if (!GLOBALS.edit) {
            return;
        }

        // If the chord edit widget is already open for this chord then
        // close it, otherwise open it.
        if (
            chordEdit.get('visible') &&
            chordEdit.get('chord') == this.model
        ) {
            chordEdit.set('visible', false);
        } else {
            chordEdit.set({
                visible: true,
                chord: this.model,
                offset: this.$el.offset()
            });
        }

    },

    render: function() {

        if (!this.model.get('measure')) {
            // only parse next measure if whole chart has been done parsing
            return;
        }

        this.$el.addClass('chord-' + this.model.get('number'));

        var font_size;

        if (this.model.get('rest')) {
            font_size = 'tiny';
        } else {
            font_size = 'normal';
        }

        this.$el.html(
            '<span class="chord-name font-size-' + font_size + '">' + 
                this.model.chartOutput() +
            '</span>'
        );

        return this;

    },

});
