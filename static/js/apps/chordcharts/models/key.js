define(
    ['collections/notes'],
    function(Notes) {

        return Backbone.Model.extend({

            initialize: function() {
                this.initData();
            },

            initData: function() {

                // Only set notes if it hasn't been set yet. Prevents errors
                // when cloning.
                if(!(this.get('notes') instanceof Backbone.Collection)) {

                    var that = this;
                    var notes = new Notes();

                    _.each(this.get('notes'), function(note_data) {
                        note_data.key = that;
                        notes.push(note_data);
                    });

                    this.set('notes', notes);

                }

            },

            /**
             * Get the note of this key at `distance_from_root`.
             */
            note: function(distance_from_root) {
                return this.get('notes').findWhere({
                    distance_from_root: distance_from_root
                });
            },

        });

    }
);
