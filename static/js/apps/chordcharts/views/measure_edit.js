define(
    [
        'collections/measure_edit_measures',
        'models/measure_edit',
        'models/measure_edit_measure',
        'views/measure_edit_measure',
    ],
    function(
        MeasureEditMeasures,
        MeasureEdit,
        MeasureEditMeasure,
        MeasureEditMeasureView
    ) {

        return Backbone.View.extend({

            model: MeasureEdit,

            initialize: function() {
                this.createMeasures()
                this.listenTo(this.model, 'change', this.change)
            },

            events: {
                'click .controls .close': 'close',
            },

            close: function() {
                this.model.set('visible', false)
            },

            change: function() {

                if(this.model.get('visible')) {

                    if(this.model.previousAttributes().visible) {
                        this.model.get('measure').set('beat_schema',
                            this.model.get('beat_schema'))
                    }

                    this.show()

                }
                else {
                    this.$el.hide()
                }

            },

            createMeasures: function() {

                var that = this
                var beat_schemas = ['4', '2-2', '2-1-1', '1-1-2', '1-1-1-1']
                var measures = []
                var measureViews = []
                var measure

                _.each(beat_schemas, function(beat_schema) {

                    measure = new MeasureEditMeasure({
                        beat_schema: beat_schema,
                        measureEdit: that.model
                    })
                    measures.push(measure)

                    measureViews.push(new MeasureEditMeasureView({
                        model: measure
                    }).render().el)

                })

                this.model.set('measures', new MeasureEditMeasures(measures))
                this.$el.find('.measures').append(measureViews)

            },

            show: function() {

                var measure = this.model.get('measure_view').$el

                this.$el.css({
                    'top': measure.offset().top + measure.height() + 10,
                    'left': measure.offset().left - 10
                })

                var current_selected = this.model.get('measures').findWhere({
                    'selected': true
                })

                if(current_selected) {
                    current_selected.set('selected', false)
                }

                this.model.get('measures').findWhere({
                    'beat_schema': this.model.get('beat_schema')
                }).set('selected', true)

                this.$el.show()

            }

        })

    }
)
