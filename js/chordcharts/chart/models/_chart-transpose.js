var Model = require('../init/_model.js');


/*
 * Model specially for the API sync that transposes the chart.
 */
module.exports = Model.extend({

    url: function() {

        return (
            GLOBALS.api_root_url +
            'chart-transpose/' +
            GLOBALS.chart_data.id + '/'
        );

    },

    isNew: function() {
        return true;
    },

    toJSON: function() {

        return {
            tonic: this.get('tonic')
        };

    }

});
