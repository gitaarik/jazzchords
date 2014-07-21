var ChordEditChordType = require('../models/chord_edit_chord_type.js');


module.exports = Backbone.View.extend({

    model: ChordEditChordType,

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click': 'chooseSymbol'
    },

    chooseSymbol: function() {
        this.model.get('editWidget').set(
            'chord_type',
            this.model.get('chord_type')
        );
    },

    render: function() {

        this.$el.html(this.model.get('symbol'));

        if(this.model.get('selected')) {
            this.$el.addClass('selected');
        }
        else {
            this.$el.removeClass('selected');
        }

    }

});
