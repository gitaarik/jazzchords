define(
    ['models/chord_edit_chord_type'],
    function(ChordEditChordType) {

        return Backbone.Collection.extend({
            model: ChordEditChordType
        })

    }
)
