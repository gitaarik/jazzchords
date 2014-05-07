define(
    ['collections/lines'],
    function(Lines) {

        return Backbone.Model.extend({

            initialize: function() {
                this.initData();
                this.initListeners();
            },

            initData: function() {

                // Only set lines if it hasn't been set yet. Prevents errors
                // when cloning.
                if(!(this.get('lines') instanceof Backbone.Collection)) {

                    var that = this;
                    var lines = new Lines();
                    lines.url = this.linesUrl();

                    _.each(this.get('lines'), function(line_data) {
                        line_data.subsection = that;
                        lines.add(line_data);
                    });

                    this.set('lines', lines);

                }

            },

            linesUrl: function() {
                return this.url() + '/lines';
            },

            initListeners: function() {
                this.stopListening();
            },

            copy: function(attributes) {

                var copy = this.clone();
                copy.set({
                    id: null,
                    lines: this.get('lines').copy({ section: copy })
                });

                if(attributes) {
                    copy.set(attributes);
                }

                copy.initListeners();

                return copy;

            },

            /**
             * Recursively saves this section and it's children (lines,
             * measures and chords).
             */
            saveRecursive: function() {

                var that = this;

                this.save(null, { success: function() {
                    that.get('lines').url = that.linesUrl();
                    that.get('lines').each(function(line) {
                        line.saveRecursive();
                    });
                }});

            },

            toJSON: function() {
                return {
                    number: this.get('number'),
                    alt_name: this.get('alt_name'),
                    key_distance_from_chart: this.get('key_distance_from_chart'),
                    time_signature: this.get('time_signature')
                };
            }

        });

    }
);
