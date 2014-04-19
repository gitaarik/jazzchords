define(
    ['models/line'],
    function(Line) {

        return Backbone.Collection.extend({
            model: Line,
        });

    }
);
