module.exports = Backbone.View.extend({

    events: {
        'show .video-url-change': 'show',
        'keyup .video-url-input': 'videoUrlInputKeyup'
    },

    show: function() {
        this.$el.find('.video-url-input').focusAtEnd();
    },

    close: function() {
        this.$el.find('.video-url-change').hide();
    },

    videoUrlInputKeyup: function(event) {

        if (event.key == "Enter") {
            this.close();
        } else {
            this.updateVideoUrl();
        }

    },

    updateVideoUrl: function() {

        var videoUrl = this.$el.find('.video-url-input').val().trim();

        if (this.model.get('video_url') != videoUrl) {
            this.model.set('video_url', videoUrl);
            this.model.save();
        }

    }

});
