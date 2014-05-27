define(
    ['models/chord_type'],
    function(ChordType) {

        return Backbone.Model.extend({
            initialize: function() {
                this.set('chord_type', new ChordType(this.get('chord_type')))
            }
        })

    }
)
