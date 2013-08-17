define(
    ['collections/chords'],
    function(Chords) {

        return Backbone.Model.extend({

            initialize: function() {

                var that = this
                var chords = []
                _.each(this.get('chords'), function(chord) {
                    chord.measure = that
                    chords.push(chord)
                })

                this.set('chords', new Chords(chords))

            }

        })

    }
)
