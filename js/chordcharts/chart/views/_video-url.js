module.exports = Backbone.View.extend({

    initialize: function() {
        this.videoUrlInputEl = this.$el.find('.video-url-input');
    },

    events: {
        'show .video-url-change': 'gotShown',
        'hide .video-url-change': 'gotClosed',
        'keyup .video-url-input': 'videoUrlInputKeyup',
        'click .buttons .save': 'save',
        'click .buttons .cancel': 'close'
    },

    gotShown: function() {
        this.videoUrlInputEl.removeClass('_invalid');
        this.originalVideoUrl = this.videoUrlInputEl.val().trim();
        this.newVideoUrl = this.originalVideoUrl;
        this.$el.find('.video-url-input').focusAtEnd();
    },

    close: function() {
        this.$el.find('.video-url-change').hide();
        this.gotClosed();
    },

    gotClosed: function() {
        this.restoreVideoUrl();
    },

    save: function() {
        if(this.videoUrlInputEl.get(0).checkValidity()) {
            this.videoUrlInputEl.removeClass('_invalid');
            this.updateVideoUrl();
            this.close();
        } else {
            this.videoUrlInputEl.formInputError('Please enter a valid URL');
        }
    },

    videoUrlInputKeyup: function(event) {

        if (event.key == "Enter") {
            this.save();
        } else {
            this.newVideoUrl = this.videoUrlInputEl.val().trim();
        }

    },

    restoreVideoUrl: function() {
        this.videoUrlInputEl.val(this.originalVideoUrl);
    },

    updateVideoUrl: function() {
        this.model.set('video_url', this.newVideoUrl);
        this.originalVideoUrl = this.newVideoUrl;
        this.model.save(null, {patch: true});
    }

});
