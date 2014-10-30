module.exports = Backbone.View.extend({

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click h1': 'toggle',
        'keyup .song-name-input': 'updateSongName'
    },

    toggle: function() {
        this.model.set('visible', !this.model.get('visible'));
    },

    render: function() {

        if (this.model.get('visible')) {
            this.$el.find('.song-name-change').show();
            this.$el.find('.song-name-input').focusAtEnd()
        } else {
            this.$el.find('.song-name-change').hide();
        }

    },

    updateSongName: function() {

        var song_name = this.$el.find('.song-name-input').val();

        this.model.set('song_name', song_name);
        this.model.save();

        this.$el.find('h1 span').text(song_name);

    }

});
