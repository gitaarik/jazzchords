var Chord = require('../models/_chord.js');


module.exports = Backbone.Collection.extend({

    model: Chord,

    copy: function(attributes) {

        var copy = this.clone();
        var chord_copy;
        var chords_copies = [];

        copy.each(function(chord) {
            chord_copy = chord.copy(attributes);
            chords_copies.push(chord_copy);
        });

        copy.reset(chords_copies);

        return copy;

    }

});
