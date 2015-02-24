module.exports = Backbone.View.extend({

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'show .song-name-change': 'show',
        'keyup .song-name-input': 'songNameInputKeyUp',
        'click .close': 'close'
    },

    show: function() {
        this.$el.find('.song-name-change').show();
        this.$el.find('.song-name-input').focusAtEnd()
    },

    close: function() {
        this.$el.find('.song-name-change').hide();
    },

    songNameInputKeyUp: function(event) {

        if (event.key == "Enter") {
            this.close();
        } else {
            this.updateSongName();
        }

    },

    updateSongName: function() {

        var songName = this.$el.find('.song-name-input').val().trim();

        if (songName && this.model.get('song_name') != songName) {

            this.model.set('song_name', songName);
            this.model.save();

            this.$el.find('h1 span').text(songName);

        }

    }

});
