define(
    ['collections/chords'],
    function(Chords) {

        return Backbone.Model.extend({
            initialize: function() {
                this.set('chords', new Chords(this.get('chords')))
            }
        })

    }
)
