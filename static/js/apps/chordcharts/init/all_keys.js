define(
    ['collections/keys'],
    function(Keys) {

        var keys = new Keys();

        _.each(GLOBALS.all_keys, function(key) {
            keys.add(key);
        });

        return keys;

    }
);
