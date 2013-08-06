define(
    ['collections/boxes'],
    function(Boxes) {

        return Backbone.Model.extend({
            initialize: function() {
                this.set('boxes', new Boxes(this.get('boxes')))
            }
        })

    }
)
