define(
    [
        'models/section',
    ],
    function(
        Section
    ) {

        return Backbone.View.extend({

            model: Section,

            events: {
            },

            initialize: function() {
                this.listenTo(this.model, 'change', this.change);
            },

            change: function() {

                if (this.model.get('visible')) {
                    this.show();
                } else {
                    this.$el.hide();
                }

            },

            show: function() {

                this.$el.css({
                    'top': this.model.get('offset').top - 11,
                    'left': this.model.get('offset').left - 11
                });

                this.$el.find('.name').html(
                    this.model.get('section').getName()
                );

                this.$el.show();

            }

        });

    }
);
