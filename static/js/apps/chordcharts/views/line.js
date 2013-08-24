define(
    ['views/measure'],
    function(MeasureView) {

        return Backbone.View.extend({

            className: 'line',

            initialize: function() {
                this.listenTo(this.model.get('measures'), 'add', this.measureAdded)
                this.listenTo(this.model.get('measures'), 'remove', this.measureRemoved)
            },

            events: {
                'click .measure-add .plus': 'addMeasure'
            },

            measureAdded: function() {

                if(this.model.get('measures').length == 8) {
                    this.$el.find('.measure-add').hide()
                }

            },

            measureRemoved: function() {

                if(!this.$el.find('.measure-add').is(':visible')) {
                    this.$el.find('.measure-add').show()
                }

            },

            addMeasure: function() {

                var last_measure = this.model.get('measures').last()
                var new_measure = last_measure.copy({
                    prev_measure: last_measure,
                    number: last_measure.get('number') + 1
                })

                last_measure.set('next_measure', new_measure)
                this.model.get('measures').add(new_measure)

                var measureView = new MeasureView({
                    model: new_measure
                })

                measureView.render().$el.insertBefore(
                    this.$el.find('.measure-add')
                )

            }

        })

    }
)
