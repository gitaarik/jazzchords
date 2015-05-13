var Model = require('../init/_model.js');
var Sections = require('../collections/_sections.js');
var Song = require('../models/_song.js');


module.exports = Model.extend({

    initialize: function() {

        // Only set sections if it hasn't been set yet. Prevents errors
        // when cloning.
        if (!(this.get('sections') instanceof Backbone.Collection)) {

            var that = this;
            var sections = new Sections();

            sections.url = this.url() + '/sections';

            _.each(this.get('sections'), function(section_data) {
                section_data.chart = that;
                sections.add(section_data);
            });

            this.set('sections', sections);

            if (!(this.get('song') instanceof Backbone.Model)) {
                this.set('song', new Song(this.get('song')));
            }

        }

    },

    url: function() {
        return GLOBALS.api_root_url + 'charts/' + this.get('id');
    },

    toJSON: function() {
        return {
            public: this.get('public'),
            short_description: this.get('short_description'),
            lyrics_url: this.get('lyrics_url'),
            video_url: this.get('video_url')
        };
    }

});
