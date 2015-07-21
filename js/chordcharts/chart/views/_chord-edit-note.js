var ChordEditNote = require('../models/_chord-edit-note.js');


module.exports = Backbone.View.extend({

    tagName: 'li',
    model: ChordEditNote,

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click': 'chooseNote'
    },

    chooseNote: function() {

        var noteType = this.model.get('note_type');
        var useAltNotation = false;

        if (
            this.model.get('editWidget').get(noteType) ==
            this.model.get('note') &&
            !this.model.get('use_alt_notation') &&
            this.model.get('note').get('alt_name')
        ) {
            useAltNotation = true;
        }

        var data = {};

        if (noteType == 'chord_note') {
            data['chord_note_alt_notation'] = useAltNotation;
        } else {
            data['alt_bass_note_alt_notation'] = useAltNotation;
        }

        data[noteType] = this.model.get('note');

        this.model.get('editWidget').set(data);

        return this;

    },

    render: function() {

        var noteNotation = this.model.get('note').get('name');

        if (this.model.get('selected')) {

            if (this.model.get('use_alt_notation')) {
                noteNotation = this.model.get('note').get('alt_name');
            }

            this.$el.addClass('selected');

        } else {
            this.$el.removeClass('selected');
        }

        this.$el.html(noteNotation);

        return this;

    }

});
