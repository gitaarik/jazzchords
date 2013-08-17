define(
    [],
    function() {

        return Backbone.Model.extend({

            close: function() {
                // Closes the edit measure without applying the changes

                this.get('measure').set('beat_schema',
                    this.get('original_beat_schema'))

                this.set({
                    'beat_schema': this.get('original_beat_schema'),
                    'visible': false
                })

            }

        })

    }
)
