define(
    ['models/chord_edit_note'],
    function(ChordEditNote) {

        return Backbone.Collection.extend({
            model: ChordEditNote
        })

    }
)

