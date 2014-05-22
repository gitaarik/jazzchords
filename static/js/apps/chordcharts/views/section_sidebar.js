define(
    ['init/line_edit'],
    function(lineEdit) {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'section-sidebar',

            initialize: function() {

                this.sidebar_template = _.template(
                    $('#template-section-sidebar-part').html()
                );

                this.initListeners();

            },

            events: {
                'mouseover': 'mouseover',
                'mouseout': 'mouseout',
                'click': 'click'
            },

            initListeners: function() {
                this.stopListening();
                this.listenTo(this.model, 'change', this.render);
            },

            mouseover: function() {
                if (GLOBALS.edit) {
                    this.model.set('mouseover', true);
                }
            },

            mouseout: function(event) {

                // A mouseout event is triggered when we append childs
                // to the section-sidebar div. So we check here if the
                // `event.relatedTarget` (which is the element the mouse
                // is now on) is a child of the sidebar.
                // If so, don't put `edit` to `false`.
                if ($(event.relatedTarget).closest('.section-sidebar').length) {
                    return;
                }

                this.model.set('mouseover', false);

            },

            click: function(event) {

                if (this.model.get('section').get('show_sidebar')) {

                    var that = this;
                    var target = $(event.target);
                    var line_number = target.closest('.section-sidebar-part').data('line-number');
                    var line = this.model.get('section').get('lines').findWhere({
                        number: line_number
                    });

                    if (
                        lineEdit.get('visible') &&
                        lineEdit.get('line') == line
                    ) {
                        lineEdit.set('visible', false);
                        this.model.set('forceMode', false);
                    } else {

                        lineEdit.set({
                            visible: true,
                            section_sidebar: this.model,
                            section: this.model.get('section'),
                            line: line,
                            offset: target.offset(),
                            onClose: function() {
                                that.model.set('forceMode', false);
                            }
                        });

                        this.model.set('forceMode', 'edit', { silent: true });

                    }

                } else {
                    this.model.get('section').set('show_sidebar', true).save();
                    this.render();
                }

            },

            render: function() {

                this.$el.html('');
                this.$el.css({
                    'height': this.model.get('section').height(),
                    'width': GLOBALS.settings.section_sidebar_width
                });

                this.renderLetters();

                return this;

            },

            renderLetters: function() {

                var mode;
                var show_sidebar = this.model.get('section').get('show_sidebar');
                var mouseover = this.model.get('mouseover');

                if (show_sidebar || mouseover) {

                    mode = this.model.get('forceMode');

                    if (!mode) {
                        if (show_sidebar) {
                            if (mouseover) {
                                mode = 'edit';
                            } else {
                                mode = 'active';
                            }
                        } else {
                            mode = 'inactive';
                        }
                    }

                    if (mode == 'edit') {
                        this.renderLetterEdit(mode);
                    } else {
                        this.renderLetterParts(mode);
                    }

                }

            },

            renderLetterParts: function(mode) {

                var that = this;
                var parts = this.getLetterParts();

                _.each(parts, function(part) {

                    var height = part.lines_number * GLOBALS.settings.box_height;

                    var part_el = $(that.sidebar_template({
                        mode: mode,
                        line_number: null,
                        letter: part.letter,
                        height: height,
                        width: GLOBALS.settings.section_sidebar_width
                    }));

                    that.$el.append(part_el);

                    if (part.lines_number > 1) {
                        that.addIndicatorLines(
                            part_el.find('canvas')[0],
                            height,
                            mode
                        );
                    }

                });
                
            },

            /**
             * Returns the parts for the letters.
             *
             * A part is one or more lines that form one subsection of
             * the song. It has two fields:
             * letter        - The letter for this part.
             * lines_number  - Number of subsequent lines that share
             *                 this letter.
             */
            getLetterParts: function() {

                var max_line_length = this.getShortestSubsequentLineLength();

                var parts = [];
                prev_line_letter = false;
                var lines_number = 0;

                this.model.get('section').get('lines').each(function(line) {

                    if (
                        lines_number == max_line_length[prev_line_letter] ||
                        prev_line_letter && prev_line_letter != line.get('letter')
                    ) {

                        parts.push({
                            letter: prev_line_letter,
                            lines_number: lines_number
                        });

                        lines_number = 0;

                    }

                    lines_number++;
                    prev_line_letter = line.get('letter');

                });

                parts.push({
                    letter: prev_line_letter,
                    lines_number: lines_number
                });

                return parts;

            },

            /**
             * Returns the shortest amount of subsequent lines with the
             * same letter.
             *
             * For example, if a section has two subsequent lines with
             * letter A, then one line with letter B, then one line with
             * letter A, then the shortest amount of subsection lines
             * for section A will be 1.
             *
             * Returns an object with the letter in the key and the
             * amount in the value.
             */
            getShortestSubsequentLineLength: function() {

                var part_shortest_linelen = {};
                var prev_line_letter = false;
                var lines = 0;

                this.model.get('section').get('lines').each(function(line) {

                    if (
                        prev_line_letter &&
                        prev_line_letter != line.get('letter') &&
                        (
                            !part_shortest_linelen[prev_line_letter] ||
                            (
                                part_shortest_linelen[prev_line_letter] &&
                                part_shortest_linelen[prev_line_letter] > lines
                            )
                        )
                    ) {
                        part_shortest_linelen[prev_line_letter] = lines;
                        lines = 0;
                    }

                    lines++;
                    prev_line_letter = line.get('letter');

                });

                if (part_shortest_linelen[prev_line_letter] > lines) {
                    part_shortest_linelen[prev_line_letter] = lines;
                }

                return part_shortest_linelen;

            },

            addIndicatorLines: function(canvas_el, height, mode) {

                var width = GLOBALS.settings.section_sidebar_width;
                var sidebar_half_width = Math.round(width / 2);
                var box_height = GLOBALS.settings.box_height;
                var line_margin = Math.round(box_height * 0.15);
                var section_half_height = Math.round(height / 2);

                canvas_el.height = height;
                canvas_el.width = width;
                var context = canvas_el.getContext('2d');

                context.lineWidth = GLOBALS.settings.border_width;

                if (mode == 'inactive') {
                    context.strokeStyle = '#CCC';
                }

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

            },

            renderLetterEdit: function(mode) {

                var that = this;

                this.model.get('section').get('lines').each(function(line) {

                    var letter_el = $(that.sidebar_template({
                        mode: mode,
                        line_number: line.get('number'),
                        letter: line.get('letter'),
                        height: GLOBALS.settings.box_height,
                        width: GLOBALS.settings.section_sidebar_width
                    }));

                    that.$el.append(letter_el);

                });

            }

        });

    }
);
