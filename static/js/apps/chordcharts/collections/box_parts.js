define(
    ['models/box_part'],
    function(BoxPart) {

        return Backbone.Collection.extend({
            model: BoxPart
        })

    }
)
