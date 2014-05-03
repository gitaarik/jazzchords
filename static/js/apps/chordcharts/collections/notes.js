define(
    ['models/note'],
    function(Note) {

        return Backbone.Collection.extend({
            model: Note
        });

    }
);
