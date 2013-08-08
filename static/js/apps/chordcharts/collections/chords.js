define(
    ['models/chord'],
    function(Chord) {

        return Backbone.Collection.extend({
            model: Chord
        })

    }
)
