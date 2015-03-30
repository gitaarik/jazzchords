module.exports = Backbone.View.extend({

    initialize: function() {
        this.lyricsUrlInputEl = this.$el.find('.lyrics-url-input');
    },

    events: {
        'show .lyrics-url-change': 'gotShown',
        'hide .lyrics-url-change': 'gotClosed',
        'keyup .lyrics-url-input': 'lyricsUrlInputKeyup',
        'click .buttons .save': 'save',
        'click .buttons .cancel': 'close'
    },

    gotShown: function() {
        this.lyricsUrlInputEl.removeClass('_invalid');
        this.originalLyricsUrl = this.lyricsUrlInputEl.val().trim();
        this.newLyricsUrl = this.originalLyricsUrl;
        this.$el.find('.lyrics-url-input').focusAtEnd();
    },

    close: function() {
        this.$el.find('.lyrics-url-change').hide();
        this.gotClosed();
    },

    gotClosed: function() {
        this.restoreLyricsUrl();
    },

    save: function() {
        if(this.lyricsUrlInputEl.get(0).checkValidity()) {
            this.lyricsUrlInputEl.removeClass('_invalid');
            this.updateLyricsUrl();
            this.close();
        } else {
            this.lyricsUrlInputEl.formInputError('Please enter a valid URL');
        }
    },

    lyricsUrlInputKeyup: function(event) {

        if (event.key == "Enter") {
            this.save();
        } else {
            this.newLyricsUrl = this.lyricsUrlInputEl.val().trim();
        }

    },

    restoreLyricsUrl: function() {
        this.lyricsUrlInputEl.val(this.originalLyricsUrl);
    },

    updateLyricsUrl: function() {
        this.model.set('lyrics_url', this.newLyricsUrl);
        this.originalLyricsUrl = this.newLyricsUrl;
        this.model.save(null, {patch: true});
    }

});
