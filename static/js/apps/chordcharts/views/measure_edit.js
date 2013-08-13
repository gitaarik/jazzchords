define(
    ['models/measure_edit'],
    function(MeasureEdit) {

        return Backbone.View.extend({

            model: MeasureEdit,

            initialize: function() {
                this.listenTo(this.model, 'change', this.render)
            },

            render: function() {

                if(this.model.get('visible')) {
                    this.show()
                }
                else {
                    this.$el.hide()
                }

            },

            show: function() {

                var measure = this.model.get('measure_view').$el

                this.$el.css({
                    'top': measure.offset().top + measure.height() + 10,
                    'left': measure.offset().left - 10
                })

                this.$el.show()

            }

        })

    }
)
