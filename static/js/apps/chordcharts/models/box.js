define(
    ['collections/box_parts'],
    function(BoxParts) {

        return Backbone.Model.extend({
            initialize: function() {
                this.set('parts', new BoxParts(this.get('parts')))
            }
        })

    }
)
