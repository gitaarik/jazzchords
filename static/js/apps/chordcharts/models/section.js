define(
    ['collections/lines'],
    function(Lines) {

        return Backbone.Model.extend({

            initialize: function() {

                var that = this;
                var lines = [];
                _.each(this.get('lines'), function(line) {
                    line.section = that;
                    lines.push(line);
                });

                this.set('lines', new Lines(lines));

            },

            recalculateHeight: function() {

                this.set('height',
                    (
                        this.get('lines').length *
                        (
                            this.get('chart').get('box_height') +
                            this.get('chart').get('border_width')
                        )
                    ) + this.get('chart').get('border_width')
                );

            },

            remove: function() {
                this.collection.remove(this);
                this.destroy();
            },

            getName: function() {

                if (this.get('alt_name')) {
                    return this.get('alt_name');
                } else {
                    return this.get('name') + ' Section';
                }

            },

        });

    }
);
