define(
    ['models/section'],
    function(Section) {

        return Backbone.Collection.extend({
            model: Section
        })

    }
)
