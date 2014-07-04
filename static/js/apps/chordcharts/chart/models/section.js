define(
    [
        'collections/lines',
        'widgets/all_keys'
    ],
    function(
        Lines,
        allKeys
    ) {

        return Backbone.Model.extend({

            initialize: function() {
                this.initData();
                this.initListeners();
            },

            initData: function() {

                // Only set lines if it hasn't been set yet. Prevents errors
                // when cloning.
                if (!(this.get('lines') instanceof Backbone.Collection)) {

                    var that = this;
                    var lines = new Lines();
                    lines.url = this.linesUrl();

                    _.each(this.get('lines'), function(line_data) {
                        line_data.section = that;
                        lines.add(line_data);
                    });

                    this.set('lines', lines);

                }

                if (!(this.get('key') instanceof Backbone.Model)) {

                    this.set(
                        'key',
                        allKeys.findWhere({
                            id: this.get('key_id')
                        })
                    );

                }

            },

            linesUrl: function() {
                return this.url() + '/lines';
            },

            initListeners: function() {
                this.stopListening();
                this.listenTo(this, 'change:alt_name', this.parseSectionNames);
            },

            /**
             * Returns the on-screen height of this section.
             */
            height: function() {
                return (
                    this.get('lines').length *
                    (
                        GLOBALS.settings.box_height +
                        GLOBALS.settings.border_width
                    )
                ) + GLOBALS.settings.border_width;
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

                if (!this.collection) {
                    // If we're not in a collection yet, this is not
                    // possible/necessary.
                    return;
                }

                var this_number = this.get('number');

                this.collection.each(function(section) {
                    if (
                        !section.get('alt_name') &&
                        section.get('number') > this_number
                    ) {
                        section.trigger('change');
                    }
                });

            },

            copy: function(attributes) {

                var copy = this.clone();
                copy.set({
                    id: null,
                    lines: this.get('lines').copy({ section: copy })
                });

                if(attributes) {
                    copy.set(attributes);
                }

                copy.initListeners();

                return copy;

            },

            /**
             * Recursively saves this section and it's children (lines,
             * measures and chords).
             */
            saveRecursive: function() {

                var that = this;

                this.save(null, { success: function() {
                    that.get('lines').url = that.linesUrl();
                    that.get('lines').each(function(line) {
                        line.saveRecursive();
                    });
                }});

            },

            toJSON: function() {
                return {
                    number: this.get('number'),
                    key_id: this.get('key').get('id'),
                    alt_name: this.get('alt_name'),
                    time_signature: this.get('time_signature'),
                    show_sidebar: this.get('show_sidebar')
                };
            }

        });

    }
);
