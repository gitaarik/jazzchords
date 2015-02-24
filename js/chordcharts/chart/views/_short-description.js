module.exports = Backbone.View.extend({

    events: {
        'show .short-description-change': 'show',
        'keyup .short-description-input': 'shortDescriptionInputKeyup'
    },

    show: function() {
        this.$el.find('.short-description-input').focusAtEnd();
    },

    close: function() {
        this.$el.find('.short-description-change').hide();
    },

    shortDescriptionInputKeyup: function(event) {

        if (event.key == "Enter") {
            this.close();
        } else {
            this.updateShortDescription();
        }

    },

    updateShortDescription: function() {

        var shortDescription = this.$el.find('.short-description-input').val().trim();

        if (this.model.get('short_description') != shortDescription) {

            this.model.set('short_description', shortDescription);
            this.model.save();

            var textEl = this.$el.find('.short-description-text');

            if (shortDescription == '') {
                textEl.html('<span class="_link">add short description</span>');
            } else {
                textEl.text(shortDescription);
            }

        }

    },

    render: function() {

    }

});
