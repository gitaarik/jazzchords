module.exports = Backbone.View.extend({

    events: {
        'show .lyrics-url-change': 'show',
        'keyup .lyrics-url-input': 'lyricsUrlInputKeyup'
    },

    show: function() {
        this.$el.find('.lyrics-url-input').focusAtEnd();
    },

    close: function() {
        this.$el.find('.lyrics-url-change').hide();
    },

    lyricsUrlInputKeyup: function(event) {

        if (event.key == "Enter") {
            this.close();
        } else {
            this.updateLyricsUrl();
        }

    },

    updateLyricsUrl: function() {

        var lyricsUrl = this.$el.find('.lyrics-url-input').val().trim();

        if (this.model.get('lyrics_url') != lyricsUrl) {
            this.model.set('lyrics_url', lyricsUrl);
            this.model.save();
        }

    }

});
