var Section = require('../models/_section.js');
var transposeWidget = require('../init/_transpose-widget.js');
var syncError = require('../init/_sync-error.js');


module.exports = Backbone.View.extend({

    model: Section,

    events: {
        'keyup .name-input': 'nameChanged',
        'click .close': 'close'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.change);
    },

    change: function() {

        if (this.model.get('visible')) {
            this.show();
        } else {
            this.$el.hide();
            this.model.get('section').save().fail(function() {
                syncError.show();
            });
        }

    },

    close: function() {
        this.model.set('visible', false);
    },

    show: function() {

        this.$el.css({
            'top': this.model.get('offset').top + 42,
            'left': this.model.get('offset').left - 15
        });

        this.$el.find('.name-input').val(
            this.model.get('section').get('name')
        );

        this.$el.show();
        this.$el.find('.name-input').focusAtEnd();

    },

    nameChanged: function(event) {

        this.model.get('section').set(
            'name', 
            this.$el.find('.name-input').val().trim()
        );

        if (event.key == 'Enter') {
            this.close();
        }

    }

});
