define(
    [],
    function() {

        /*
         * Model specially for the API sync that updates the section's
         * key without changing the chords.
         */
        return Backbone.Model.extend({

            url: function() {

                return (
                    GLOBALS.api_root_url +
                    'section-key/' +
                    this.get('section').get('id') + '/'
                );

            },

            isNew: function() {
                return true;
            },

            toJSON: function() {

                return {
                    tonic: this.get('tonic'),
                    tonality: this.get('tonality')
                };

            }

        });

    }
);
