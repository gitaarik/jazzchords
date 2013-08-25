define(
    ['models/measure'],
    function(Measure) {

        return Backbone.Collection.extend({

            model: Measure,

            delete: function(measure) {
                this.remove(measure)
                measure.destroy()
            }

        })

    }
)
