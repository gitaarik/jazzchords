module.exports = Backbone.View.extend({

    initialize: function() {
        this.shortDescriptionTextEl = this.$el.find('.short-description-text');
        this.shortDescriptionInputEl = this.$el.find('.short-description-input');
    },

    events: {
        'show .short-description-change': 'gotShown',
        'hide .short-description-change': 'gotClosed',
        'keyup .short-description-input': 'shortDescriptionInputKeyup',
        'click .buttons .save': 'save',
        'click .buttons .cancel': 'close'
    },

    gotShown: function() {
        this.originalShortDescription = this.shortDescriptionTextEl.text().trim();
        this.newShortDescription = this.originalShortDescription;
        this.shortDescriptionInputEl.val(this.originalShortDescription).focusAtEnd();
    },

    close: function() {
        this.$el.find('.short-description-change').hide();
        this.gotClosed();
    },

    gotClosed: function() {
        this.restoreShortDescription();
    },

    save: function() {
        this.updateShortDescription();
        this.close();
    },

    shortDescriptionInputKeyup: function(event) {

        if (event.key == "Enter") {
            this.save();
        } else {

            this.newShortDescription = this.shortDescriptionInputEl.val().trim();

            if (this.newShortDescription == '') {
                this.shortDescriptionTextEl.html('<span class="_link">add short description</span>');
            } else {
                this.shortDescriptionTextEl.text(this.newShortDescription);
            }

        }

    },

    restoreShortDescription: function() {
        this.shortDescriptionTextEl.text(this.originalShortDescription);
    },

    updateShortDescription: function() {
        this.model.set('short_description', this.newShortDescription);
        this.originalShortDescription = this.newShortDescription;
        this.model.save(null, {patch: true});
    }

});
