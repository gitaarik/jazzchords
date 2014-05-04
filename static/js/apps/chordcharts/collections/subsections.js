define(
    ['models/subsection'],
    function(Subsection) {

        return Backbone.Collection.extend({
            model: Subsection
        });

    }
);
