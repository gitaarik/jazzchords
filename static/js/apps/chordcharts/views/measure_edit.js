define(
    [
        'models/measure_edit',
        'models/measure_edit_measure',
        'views/measure_edit_measure',
    ],
    function(
        MeasureEdit,
        MeasureEditMeasure,
        MeasureEditMeasureView
    ) {

        return Backbone.View.extend({

            model: MeasureEdit,

            initialize: function() {
                this.createMeasures()
                this.listenTo(this.model, 'change', this.render)
            },

            createMeasures: function() {

                var beat_schemas = ['4', '2-2', '2-1-1', '1-1-2', '1-1-1-1']
                var measures = []
                var measureViews = []
                var measure

                _.each(beat_schemas, function(beat_schema) {

                    measure = new MeasureEditMeasure({
                        beat_schema: beat_schema
                    })
                    measures.push(measure)

                    measureViews.push(new MeasureEditMeasureView({
                        model: measure
                    }).render().el)

                })
                
                this.$el.find('.measures').append(measureViews)

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
