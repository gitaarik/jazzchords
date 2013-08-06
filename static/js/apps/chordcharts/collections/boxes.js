define(
    ['models/box'],
    function(Box) {

        return Backbone.Collection.extend({
            model: Box
        })

    }
)
