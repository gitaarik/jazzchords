define(
    ['models/chart_key'],
    function(ChartKey) {

        return Backbone.View.extend({

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
                if(this.model.get('visible')) {
                    this.$el.find('.open').show();
                } else {
                    this.$el.find('.open').hide();
                }
            },

            changeKey: function(el) {

                if (!GLOBALS.edit) {
                    return;
                }

                var target = $(el.target);

                new ChartKey({
                    tonic: target.data('key-tonic')
                }).save(null, { success: function() {
                    // Refresh the page so that the transposition will
                    // be visible on the screen. A simple solution for
                    // now. We don't want to put the key in the URL
                    // because:
                    // If you change the key of the first section, you
                    // thus change the key for the complete chart, if
                    // the key would be in the URL and you would refresh
                    // the page, you would transpose the chart again,
                    // which is not what you want.
                    location.reload();
                }});

            }

        });

    }
);
