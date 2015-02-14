var ChartInfo = require('../models/_chart-info.js');


module.exports = Backbone.View.extend({

    model: ChartInfo,

    initialize: function() {
        this.listenTo(this.model.get('chart'), 'change', this.render);
    },

    render: function() {

        var template = _.template(
            $('#template-chart-info').html()
        );

        var chart = this.model.get('chart');
        var short_description = chart.get('short_description');

        if (!short_description) {
            short_description = '[no info]';
        }

        this.$el.html(
            template({
                short_description: short_description,
                lyrics_url: chart.get('lyrics_url'),
                video_url: chart.get('video_url'),
                author: chart.get('owner')['username']
            })
        );

        if (!(chart.get('lyrics_url') || chart.get('video_url'))) {
            this.$el.find('.links-container').hide();
        } else {

            if (!chart.get('lyrics_url')) {
                this.$el.find('.links .lyrics-url').hide();
            }

            if (!chart.get('video_url')) {
                this.$el.find('.links .video-url').hide();
            }

            if (!(chart.get('lyrics_url') && chart.get('video_url'))) {
                this.$el.find('.links .links-separator').hide();
            }

        }

        return this;

    }

});
