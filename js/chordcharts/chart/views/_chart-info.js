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

        this.$el.html(
            template({
                short_description: chart.get('short_description'),
                lyrics_url: chart.get('lyrics_url'),
                video_url: chart.get('video_url')
            })
        );

        return this;

    }

});
