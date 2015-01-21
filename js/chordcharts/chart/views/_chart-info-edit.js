var ChartInfoEdit = require('../models/_chart-info-edit.js');


module.exports = Backbone.View.extend({

    model: ChartInfoEdit,

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'show': 'render',
        'click .save-button': 'save',
        'click .cancel-button': 'cancel'
    },

    render: function() {

        this.$el.find('input[name=short_description]').val(
            this.model.get('chart').get('short_description')
        ).focusAtEnd();

        this.$el.find('input[name=video_url]').val(
            this.model.get('chart').get('video_url')
        );

        this.$el.find('input[name=lyrics_url]').val(
            this.model.get('chart').get('lyrics_url')
        );

    },

    hide: function() {
        this.$el.hide();
    },

    cancel: function(event) {
        event.preventDefault();
        this.hide();
    },

    save: function(event) {

        event.preventDefault();

        var chart = this.model.get('chart');

        chart.set({
            short_description: this.$el.find('input[name=short_description]').val(),
            video_url: this.$el.find('input[name=video_url]').val(),
            lyrics_url: this.$el.find('input[name=lyrics_url]').val()
        });

        chart.save();
        this.hide();

    }

});
