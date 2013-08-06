define(
    ['collections/lines'],
    function(Lines) {

        return Backbone.Model.extend({
            initialize: function() {
                this.set('lines', new Lines(this.get('lines')))
            }
        })

    }
)
