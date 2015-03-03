module.exports = Backbone.View.extend({

    events: {
        'show .lyrics-url-change': 'gotShow',
        'hide .lyrics-url-change': 'gotClosed',
        'keyup .lyrics-url-input': 'lyricsUrlInputKeyup'
    },

    gotShow: function() {
        this.$el.find('.lyrics-url-input').focusAtEnd();
    },

    close: function() {
        this.$el.find('.lyrics-url-change').hide();
        this.gotClosed();
    },

    gotClosed: function() {
        this.updatelyricsUrl();
    },

    lyricsUrlInputKeyup: function(event) {

        if (event.key == "Enter") {
            this.close();
        } else {
            this.model.set('lyrics_url', this.$el.find('.lyrics-url-input').val().trim());
        }

    },

    updatelyricsUrl: function() {
        this.model.save();
    }

});
