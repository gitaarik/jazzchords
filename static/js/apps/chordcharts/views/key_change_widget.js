define(
    [],
    function() {

        return Backbone.View.extend({

            initialize: function() {
                this.listenTo(this.model, 'change', this.render)
            },

            events: {
                'click .closed': 'open'
            },

            open: function() {
                this.model.set('visible', true)
            },

            render: function() {

                if(this.model.get('visible')) {
                    this.$el.find('.open').show()
                }
                else {
                    this.$el.find('.open').hide()
                }

            }

        })

    }
)
