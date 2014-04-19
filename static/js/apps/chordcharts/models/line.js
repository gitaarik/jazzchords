define(
    ['collections/measures', 'models/measure'],
    function(Measures, Measure) {

        return Backbone.Model.extend({

            initialize: function() {

                // Only set measures if it hasn't been set yet. Prevents errors
                // when cloning.
                if(!(this.get('measures') instanceof Backbone.Collection)) {

                    var that = this;
                    var measures = [];
                    var measure;

                    _.each(this.get('measures'), function(measure_data) {
                        measure_data.line = that;
                        measure = new Measure(measure_data);
                        measures.push(measure);
                    });

                    this.set('measures', new Measures(measures));

                }

                this.initListeners();

            },

            initListeners: function() {
                this.stopListening();
                this.listenTo(this.get('measures'), 'remove', this.measureRemoved);
            },

            measureRemoved: function() {

                if(!this.get('measures').length) {
                    this.destroy();
                }

            },

            copy: function(attributes) {

                var copy = this.clone();
                copy.set('measures', this.get('measures').copy({ line: copy }));

                if(attributes) {
                    copy.set(attributes);
                }

                copy.initListeners();

                return copy;

            }

        });

    }
);
