define(
    ['models/subsection'],
    function(Subsection) {

        return Backbone.Collection.extend({

            model: Subsection,

            copy: function(attributes) {

                var copy = this.clone();
                var subsection_copy;
                var subsection_copies = [];

                copy.each(function(subsection) {
                    subsection_copy = subsection.copy(attributes);
                    subsection_copies.push(subsection);
                });

                copy.reset(subsection_copies);

                return copy;

            }

        });

    }
);
