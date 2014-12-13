var ChartTranspose = require('../models/_chart-transpose.js');
var syncError = require('../init/_sync-error.js');


module.exports = Backbone.View.extend({

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click .closed': 'toggle',
        'click .open .current-key': 'toggle',
        'click .key-tonics li a': 'changeKey'
    },

    toggle: function() {
        this.model.set('visible', !this.model.get('visible'));
    },

    render: function() {

        if (this.model.get('visible')) {
            this.$el.find('.open').show();
        } else {
            this.$el.find('.open').hide();
        }

        if (this.model.has('key')) {

            var key = this.model.get('key');

            this.$el.find('.key-name').html(key.get('name'));

            this.$el.find('.key-tonics li').removeClass('selected');
            this.$el.find(
                '.key-tonics li[data-key-tonic=' +
                    key.get('tonic') +
                ']'
            ).addClass('selected');

        }

    },

    changeKey: function(el) {

        if (!GLOBALS.edit) {
            return;
        }

        var target = $(el.target);

        new ChartTranspose({
            tonic: target.parent().data('key-tonic')
        }).save().done(function() {
            // Refresh the page so that the transposition will
            // be visible on the screen. A simple solution for
            // now. We don't want to put the tonic in the URL
            // because:
            // If you change the key of the first section, you
            // thus change the key for the complete chart, if
            // the key would be in the URL and you would refresh
            // the page, you would transpose the chart again,
            // which is not what you want.
            location.reload();
        }).fail(function() {
            syncError.show();
        });

    }

});
