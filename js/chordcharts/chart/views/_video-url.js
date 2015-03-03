module.exports = Backbone.View.extend({

    events: {
        'show .video-url-change': 'gotShow',
        'hide .video-url-change': 'gotClosed',
        'keyup .video-url-input': 'videoUrlInputKeyup'
    },

    gotShow: function() {
        this.$el.find('.video-url-input').focusAtEnd();
    },

    close: function() {
        this.$el.find('.video-url-change').hide();
        this.gotClosed();
    },

    gotClosed: function() {
        this.updateVideoUrl();
    },

    videoUrlInputKeyup: function(event) {

        if (event.key == "Enter") {
            this.close();
        } else {
            this.model.set('video_url', this.$el.find('.video-url-input').val().trim());
        }

    },

    updateVideoUrl: function() {
        this.model.save();
    }

});
