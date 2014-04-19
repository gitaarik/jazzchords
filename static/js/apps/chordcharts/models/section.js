define(
    ['collections/lines', 'models/line'],
    function(Lines, Line) {

        return Backbone.Model.extend({

            initialize: function() {
                this.initData();
                this.initListeners();
            },

            initData: function() {

                // Only set lines if it hasn't been set yet. Prevents errors
                // when cloning.
                if(!(this.get('lines') instanceof Backbone.Collection)) {

                    var that = this;
                    var lines = [];
                    var line;

                    _.each(this.get('lines'), function(line_data) {
                        line_data.section = that;
                        line = new Line(line_data);
                        lines.push(line);
                    });

                    this.set('lines', new Lines(lines));

                }

            },

            initListeners: function() {
                this.listenTo(this, 'change', this.parseSectionNames);
            },

            /**
             * Returns the on-screen height of this section.
             */
            getHeight: function() {

                return (
                    this.get('lines').length *
                    (
                        this.get('chart').get('box_height') +
                        this.get('chart').get('border_width')
                    )
                ) + this.get('chart').get('border_width');

            },

            /**
             * Remove this section from the chart.
             */
            remove: function() {
                this.collection.remove(this);
                this.destroy();
            },

            /**
             * Returns the name of the section.
             *
             * If `alt_name` is set, this will be used, otherwise,
             * `getSequenceLetter()` will be used.
             */
            getName: function() {

                if (this.get('alt_name')) {
                    return this.get('alt_name');
                } else {
                    return this.getSequenceLetter() + ' Section';
                }

            },

            /**
             * Returns the sequence letter this section would have in
             * case he wouldn't have an `alt_name`.
             */
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

            /**
             * Parses the names for the sections following this one.
             *
             * The section names will be based on this section name. For
             * example, if this is the first section and it has a an
             * `alt_name`, and the next section doesn't have an
             * `alt_name`, then this section can take the sequence name
             * `A`. If this section wouldn't have an `alt_name`, this
             * section's sequence letter would be `A` so the next sectin
             * would know it should have sequence letter `B`.
             */
            parseSectionNames: function() {

                var this_number = this.get('number');

                var section = this.collection.find(function(section) {
                    return(
                        !section.get('alt_name') &&
                        section.get('number') > this_number
                    );
                });

                if (section) {
                    section.trigger('change');
                }

            }

        });

    }
);
