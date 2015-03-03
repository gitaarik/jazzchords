module.exports = Backbone.View.extend({

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'show .song-name-change': 'gotShown',
        'hide .song-name-change': 'gotClosed',
        'keyup .song-name-input': 'songNameInputKeyUp'
    },

    gotShown: function() {
        this.$el.find('.song-name-input').focusAtEnd()
    },

    close: function() {
        this.$el.find('.song-name-change').hide();
        this.gotClosed();
    },

    gotClosed: function() {
        this.updateSongName();
    },

    songNameInputKeyUp: function(event) {

        if (event.key == "Enter") {
            this.close();
        } else {

            var newSongName = (
                this.$el.find('.song-name-input').val().trim()
                || '- Untitled -'
            );

            this.model.set('song_name', newSongName);
            this.$el.find('h1 span').text(this.model.get('song_name'));

        }

    },

    updateSongName: function() {

        if (this.model.get('song_name')) {
            this.model.save();
        }

    }

});
