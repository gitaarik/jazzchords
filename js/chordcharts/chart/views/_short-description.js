module.exports = Backbone.View.extend({

    events: {
        'show .short-description-change': 'gotShown',
        'hide .short-description-change': 'gotClosed',
        'keyup .short-description-input': 'shortDescriptionInputKeyup'
    },

    gotShown: function() {
        this.$el.find('.short-description-input').focusAtEnd();
    },

    close: function() {
        this.$el.find('.short-description-change').hide();
        this.gotClosed();
    },

    gotClosed: function() {
        this.updateShortDescription();
    },

    shortDescriptionInputKeyup: function(event) {

        if (event.key == "Enter") {
            this.close();
        } else {

            var shortDescription = this.$el.find('.short-description-input').val().trim();
            var textEl = this.$el.find('.short-description-text');

            if (shortDescription == '') {
                textEl.html('<span class="_link">add short description</span>');
            } else {
                textEl.text(shortDescription);
            }

            this.model.set('short_description', shortDescription);

        }

    },

    updateShortDescription: function() {
        this.model.save();
    }

});
