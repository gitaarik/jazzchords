define(
    ['models/measure'],
    function(Measure) {

        return Backbone.Collection.extend({

            model: Measure,

            delete: function(measure) {

                var prev_measure = measure.get('prev_measure')
                var next_measure = measure.get('next_measure')

                if(prev_measure) {

                    if(next_measure) {
                        next_measure.set({
                            'prev_measure': prev_measure,
                            'number': measure.get('number')
                        })
                        prev_measure.set('next_measure', next_measure)
                    }
                    else {
                        prev_measure.unset('next_measure')
                    }

                }

                this.remove(measure)
                measure.destroy()

            }

        })

    }
)
