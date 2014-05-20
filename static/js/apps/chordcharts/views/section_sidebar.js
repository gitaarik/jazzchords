define(
    [],
    function() {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'section-sidebar',

            initialize: function() {
                this.initListeners();
            },

            events: {
                'mouseenter': 'mouseEnter',
                'mouseout': 'mouseOut'
            },

            initListeners: function() {
                this.stopListening();
                this.listenTo(this.model, 'change', this.render);
            },

            mouseEnter: function() {
                if (GLOBALS.edit) {
                    this.model.set('edit', true);
                }
            },

            mouseOut: function() {
                this.model.set('edit', false);
            },

            render: function() {

                this.$el.html('');
                this.$el.css({
                    'height': this.model.get('section').height(),
                    'width': GLOBALS.settings.section_sidebar_width
                });

                this.renderLetterParts();

                return this;

            },

            renderLetterParts: function() {

                var that = this;
                var parts = this.getLetterParts();

                _.each(parts, function(part) {

                    var template = _.template(
                        $('#template-section-sidebar-part').html()
                    );
                    var height = part.lines_number * GLOBALS.settings.box_height;

                    var part_el = $(template({
                        'letter': part.letter,
                        'height': height,
                        'width': GLOBALS.settings.section_sidebar_width
                    }));

                    that.$el.append(part_el);

                    that.addIndicatorLines(
                        part_el.find('canvas')[0],
                        height
                    );

                });
                
            },

            /**
             * Returns the parts for the letters.
             *
             * A part is an object with two fields:
             * letter        - The letter for this part.
             * lines_number  - Number of subsequent lines that share
             *                 this letter.
             */
            getLetterParts: function() {

                var parts = [];
                var prev_line_letter = false;
                var lines_number = 0;

                this.model.get('section').get('lines').each(function(line) {

                    lines_number++;

                    if (prev_line_letter && prev_line_letter != line.get('letter')) {

                        parts.push({
                            letter: prev_line_letter,
                            lines_number: lines_number
                        });

                        lines_number = 0;

                    }

                    prev_line_letter = line.get('letter');

                });

                parts.push({
                    letter: prev_line_letter,
                    lines_number: lines_number
                });

                return parts;

            },

            addIndicatorLines: function(canvas_el, height) {

                var width = GLOBALS.settings.section_sidebar_width;
                var sidebar_half_width = Math.round(width / 2);
                var box_height = GLOBALS.settings.box_height;
                var line_margin = Math.round(box_height * 0.15);
                var section_half_height = Math.round(height / 2);

                canvas_el.height = height;
                canvas_el.width = width;
                var context = canvas_el.getContext('2d');

                context.lineWidth = GLOBALS.settings.border_width;

                // from top to title
                context.beginPath();

                context.moveTo(sidebar_half_width, line_margin);
                context.lineTo(
                    sidebar_half_width,
                    (section_half_height - 5 - line_margin)
                );
                context.stroke();

                // from title to bottom
                context.beginPath();
                context.moveTo(
                    sidebar_half_width,
                    section_half_height + 5 + line_margin
                );
                context.lineTo(
                    sidebar_half_width,
                    (height - line_margin)
                );
                context.stroke();

                // from top to right
                context.beginPath();
                context.moveTo(sidebar_half_width, line_margin);
                context.lineTo(width - 5, line_margin);
                context.stroke();

                // from bottom to right
                context.beginPath();
                context.moveTo(
                    sidebar_half_width,
                    (height - line_margin)
                );
                context.lineTo(
                    width - 5,
                    (height - line_margin)
                );
                context.stroke();

            }

        });

    }
);
