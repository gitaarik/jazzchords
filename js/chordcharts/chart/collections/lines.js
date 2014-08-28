var Line = require('../models/line.js');


module.exports = Backbone.Collection.extend({

    model: Line,

    copy: function(attributes) {

        var copy = this.clone();
        var line_copy;
        var line_copies = [];

        copy.each(function(line) {
            line_copy = line.copy(attributes);
            line_copies.push(line_copy);
        });

        copy.reset(line_copies);

        return copy;

    }

});
