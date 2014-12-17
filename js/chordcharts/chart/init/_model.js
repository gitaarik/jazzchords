var syncError = require('../init/_sync-error.js');


module.exports = Backbone.Model.extend({

    sync: function() {

        return Backbone.sync.apply(this, arguments).fail(function() {
            syncError.show();
        });

    }

});
