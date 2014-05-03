define(
    ['models/key'],
    function(Key) {

        return Backbone.Collection.extend({
            model: Key
        });

    }
);
