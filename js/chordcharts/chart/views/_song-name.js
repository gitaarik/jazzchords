module.exports = Backbone.View.extend({

    initialize: function() {
        this.songNameEl = this.$el.find('h1 span');
        this.songNameInputEl = this.$el.find('.song-name-input');
    },

    events: {
        'show .song-name-change': 'gotShown',
        'hide .song-name-change': 'gotClosed',
        'keyup .song-name-input': 'songNameInputKeyUp',
        'click .buttons .save': 'save',
        'click .buttons .cancel': 'close'
    },

    gotShown: function() {
        this.originalSongName = this.songNameEl.text().trim();
        this.newSongName = this.originalSongName;
        this.songNameInputEl.val(this.originalSongName).focusAtEnd()
    },

    close: function() {
        this.$el.find('.song-name-change').hide();
        this.gotClosed();
    },

    gotClosed: function() {
        this.restoreSongName();
    },

    save: function() {
        this.updateSongName();
        this.close();
    },

    songNameInputKeyUp: function(event) {

        if (event.key == "Enter") {
            this.save();
        } else {

            this.newSongName = (
                this.songNameInputEl.val().trim()
                || '- Untitled -'
            );

            this.songNameEl.text(this.newSongName);

        }

    },

    restoreSongName: function() {
        this.songNameEl.text(this.originalSongName);
    },

    updateSongName: function() {

        if (this.newSongName) {
            this.model.set('song_name', this.newSongName);
            this.originalSongName = this.newSongName;
            this.model.save();
        }

    }

});
