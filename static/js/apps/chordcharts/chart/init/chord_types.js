var ChordTypes = require('../collections/chord_types.js');


var chord_types = new ChordTypes();

_.each(GLOBALS.chord_types, function(chord_type) {
    chord_types.add(chord_type);
});

module.exports = chord_types;
