define(
    ['models/chord_type'],
    function(ChordType) {

        return Backbone.Collection.extend({
            model: ChordType
        });

    }
);
