define(
    [],
    function() {

        /*
         * Model specially for the API sync that updates the chart's
         * key (which will transpose all chords).
         */
        return Backbone.Model.extend({

            url: function() {

                return (
                    GLOBALS.api_root_url +
                    'chart-transpose/' +
                    GLOBALS.chart_data.id + '/'
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
