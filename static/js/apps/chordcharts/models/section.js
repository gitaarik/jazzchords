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

                this.listenTo(this, 'change', this.parseSectionNames);

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
                    return this.getSequenceLetter() + ' Section';
                }

            },

            getSequenceLetter: function() {

                var this_number = this.get('number');

                var sections = this.collection.filter(function(section) {
                    return (
                        !section.get('alt_name') &&
                        section.get('number') < this_number
                    );
                });

                return 'ABCDEFG'[sections.length];

            },

            parseSectionNames: function() {

                var this_number = this.get('number');

                this.collection.each(function(section) {

                    if(
                        !section.get('alt_name') &&
                        section.get('number') > this_number
                    ) {
                        section.trigger('change');
                    }

                });

            }

        });

    }
);
