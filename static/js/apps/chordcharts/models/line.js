define(
    ['collections/measures'],
    function(Measures) {

        return Backbone.Model.extend({
            initialize: function() {
                this.set('measures', new Measures(this.get('measures')))
            }
        })

    }
)
