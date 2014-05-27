define(
    ['collections/chord_types'],
    function(ChordTypes) {

        var chord_types = new ChordTypes();

        _.each(GLOBALS.chord_types, function(chord_type) {
            chord_types.add(chord_type);
        });

        return chord_types;

    }
);
