module.exports = Backbone.Model.extend({

    defaults: {
        visible: false
    },

    url: (
        GLOBALS.api_root_url +
        'chart-song-name/' +
        GLOBALS.chart_data.id + '/'
    ),

    isNew: function() {
        return true;
    },

    toJSON: function() {

        return {
            song_name: this.get('song_name'),
        };

    }

});
