var Model = require('../init/_model.js');
var ChordType = require('./_chord-type.js');


module.exports = Model.extend({
    initialize: function() {
        this.set('chord_type', new ChordType(this.get('chord_type')));
    }
});
