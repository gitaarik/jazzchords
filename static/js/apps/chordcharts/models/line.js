define(
    ['collections/measures', 'models/measure'],
    function(Measures, Measure) {

        return Backbone.Model.extend({

            initialize: function() {

                var that = this
                var measuresData = this.get('measures')
                var measures = []
                var prev_measure = null

                for(var i = 0; i < measuresData.length; i++) {

                    measures[i] = new Measure(measuresData[i])
                    measures[i].set('line', this)

                    if(measures[i - 1]) {
                        measures[i].set('prev_measure', measures[i - 1])
                    }

                    if(prev_measure) {
                        prev_measure.set('next_measure', measures[i])
                    }

                    var prev_measure = measures[i]

                }

                this.set('measures', new Measures(measures))

                this.listenTo(this.get('measures'), 'remove', this.measureRemoved)

            },

            measureRemoved: function() {

                if(!this.get('measures').length) {
                    this.destroy()
                }

            },

            copy: function() {

                var copy = this.clone()
                var measure = this.get('measures').first().copy()

                measure.unset('next_measure')
                copy.get('measures').reset([measure])

                return copy

            }

        })

    }
)
