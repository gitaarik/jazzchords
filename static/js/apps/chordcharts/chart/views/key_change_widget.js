define(
    [],
    function() {

        return Backbone.View.extend({

            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            events: {
                'click .closed': 'toggle',
                'click .open .current-key': 'toggle',
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
            }

        });

    }
);
