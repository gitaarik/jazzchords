define(
    ['models/line', 'views/line', 'init/section_edit'],
    function(Line, LineView, SectionEdit) {

        return Backbone.View.extend({

            className: 'section',

            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            events: {
                'click .section-header .name': 'openSectionEdit',
                'click .section-header .section-edit-buttons .remove': 'removeSection',
                'click .line-add .plus': 'addLine',
            },

            addLine: function() {

                var line = this.model.get('lines').last().copy();

                this.model.get('lines').add(line);

                var lineView = new LineView({
                    model: line
                });

                lineView.render().$el.insertBefore(this.$el.find('.line-add'));

                this.model.recalculateHeight();
                this.renderSidebar();

                this.listenTo(this.model.get('lines'), 'remove', function() {
                    this.model.recalculateHeight();
                    this.renderSidebar();
                });

            },

            openSectionEdit: function(event) {

                SectionEdit.set({
                    visible: true,
                    section: this.model,
                    offset: $(event.target).offset()
                });

            },

            render: function() {

                this.renderHeader();
                this.renderSidebar();

            },

            renderHeader: function() {

                this.$el.find('.section-header .name').html(
                    this.model.getName()
                );

            },

            renderSidebar: function() {

                if (this.model.get('alt_name')) {
                    this.$el.find('.section-sidebar-letter').html('');
                    this.$el.find('.section-sidebar canvas').remove();
                } else {

                    this.$el.find('.section-sidebar-letter').html(
                        this.model.getSequenceLetter()
                    );
                    this.$el.find('.section-sidebar-letter').css(
                        'line-height',
                        this.model.get('height') + 'px'
                    );
                    this.redrawIndicatorLines();

                }

            },

            redrawIndicatorLines: function() {

                // Draws the lines that indicate the start and end of a section

                if (this.model.get('alt_name')) {
                    // should not happen for sections that have an
                    // `alt_name`.
                    return;
                }

                this.$el.find('.section-sidebar canvas').remove();

                var canvas = document.createElement('canvas');
                var sidebar_width = this.model.get('chart').get(
                    'section_sidebar_width');
                var sidebar_half_width = Math.round(sidebar_width / 2);
                var box_height = this.model.get('chart').get('box_height');
                var line_margin = Math.round(box_height * 0.15);
                var section_height = this.model.get('height');
                var section_half_height = Math.round(section_height / 2);

                canvas.height = section_height;
                canvas.width = sidebar_width;
                $(canvas).css('height', section_height + 'px');
                var context = canvas.getContext('2d');

                context.lineWidth = this.model.get('chart').get('border_width');

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
                    (section_height - line_margin)
                );
                context.stroke();

                // from top to right
                context.beginPath();
                context.moveTo(sidebar_half_width, line_margin);
                context.lineTo(sidebar_width - 5, line_margin);
                context.stroke();

                // from bottom to right
                context.beginPath();
                context.moveTo(
                    sidebar_half_width,
                    (section_height - line_margin)
                );
                context.lineTo(
                    sidebar_width - 5,
                    (section_height - line_margin)
                );
                context.stroke();

                this.$el.find('.section-sidebar').append(canvas);

            },

            removeSection: function() {

                if (confirm("Are you sure you want to remove this section?")) {
                    this.model.remove();
                    this.remove();
                }

            }

        });

    }
);
