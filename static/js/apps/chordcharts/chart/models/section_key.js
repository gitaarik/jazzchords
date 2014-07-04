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

                var key = this.get('section').get('key');

                return {
                    tonic: key.get('tonic'),
                    tonality: key.get('tonality')
                };

            }

        });

    }
);
