define(
    ['models/measure'],
    function(Measure) {

        return Backbone.Collection.extend({

            model: Measure,

            initialize: function(models) {
                this.initPrevNextMeasures(models);
            },

            initPrevNextMeasures: function(models) {

                var prev_measure = null;

                _.each(models, function(measure) {

                    if (prev_measure) {
                        prev_measure.set('next_measure', measure);
                        measure.set('prev_measure', prev_measure);
                    }

                    prev_measure = measure;

                });

            },

            copy: function(attributes) {

                var copy = this.clone();
                var measure_copy;
                var measure_copies = [];
                var prev_measure;

                copy.each(function(measure) {
                    measure_copy = measure.copy(attributes);
                    measure_copies.push(measure_copy);
                });

                copy.reset(measure_copies);
                copy.initPrevNextMeasures(copy.models);

                return copy;

            }

        });

    }
);
