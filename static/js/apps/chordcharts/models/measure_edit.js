define(
    [],
    function() {

        return Backbone.Model.extend({

            discard: function() {
                this.discardChanges()
                this.close()
            },

            discardChanges: function() {
                this.get('measure').set('beat_schema',
                    this.get('original_beat_schema'))
            },

            close: function() {
                // Closes the edit measure without applying the changes
                this.set({
                    'beat_schema': this.get('original_beat_schema'),
                    'visible': false
                })

            }

        })

    }
)
