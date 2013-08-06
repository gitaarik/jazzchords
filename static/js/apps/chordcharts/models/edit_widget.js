define(
    [],
    function() {

        return Backbone.Model.extend({

            chordName: function() {
                // Returns the chordName for this editWidget

                var bass_note
                if(this.get('alt_bass_note')) {
                    bass_note = '/' + this.get('alt_bass_note').name
                }
                else {
                    bass_note = ''
                }

                return this.get('note').name +
                    this.get('chord_type').get('chord_output') + bass_note

            },

        })

    }
)
