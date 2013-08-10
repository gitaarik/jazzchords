define(
    ['models/measure'],
    function(Measure) {

        return Backbone.Collection.extend({
            model: Measure
        })

    }
)
