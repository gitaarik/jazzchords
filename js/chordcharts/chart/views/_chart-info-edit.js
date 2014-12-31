var ChartInfoEdit = require('../models/_chart-info-edit.js');


module.exports = Backbone.View.extend({

    model: ChartInfoEdit,

    initialize: function() {
        this.listenTo(this.model, 'change', this.change);
    },

    events: {
        'click .close': 'close',
    },

    close: function() {
        this.model.set('visible', false);
    },

    change: function() {

        console.log("oomg!");

    }

});
