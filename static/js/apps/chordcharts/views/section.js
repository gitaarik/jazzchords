define(
    ['models/line', 'views/line', 'init/section_edit'],
    function(Line, LineView, SectionEdit) {

        return Backbone.View.extend({

            tagName: 'section',
            className: 'section',

            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            events: {
                'click .section-header .name': 'openSectionEdit',
                'click .section-header .section-edit-buttons .move-up': 'moveUp',
                'click .section-header .section-edit-buttons .move-down': 'moveDown',
                'click .section-header .section-edit-buttons .remove': 'removeSection',
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
                this.renderSubsections();
                return this;
            },

            renderHeader: function() {

                var template = _.template(
                    $('#template-section-header').html()
                );

                var section_header = template({
                    section_name: this.model.getName()
                });

                var section_header_el = this.$el.find('.section-header');

                if (section_header_el.length) {
                    section_header_el.replaceWith(section_header);
                } else {
                    this.$el.append(section_header);
                }

                if (this.model.get('number') == 1) {
                    this.$el.find(
                        '.section-header .section-edit-buttons .move-up'
                    ).hide();
                } else if (
                    this.model.get('number') == this.model.collection.length
                ) {
                    this.$el.find(
                        '.section-header .section-edit-buttons .move-down'
                    ).hide();
                }

            },

            renderSidebar: function() {

                if (!this.$el.find('.section-sidebar').length) {
                    this.$el.append(_.template(
                        $('#template-section-sidebar').html()
                    )());
                }

                if (this.model.get('alt_name')) {
                    this.$el.find('.section-sidebar-letter').html('');
                    this.$el.find('.section-sidebar canvas').remove();
                } else {

                    this.$el.find('.section-sidebar-letter').html(
                        this.model.getSequenceLetter()
                    );

                    this.$el.find('.section-sidebar').css(
                        'height',
                        this.model.getHeight()
                    );

                    this.$el.find('.section-sidebar-letter').css(
                        'line-height',
                        this.model.getHeight() + 'px'
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
                var section_height = this.model.getHeight();
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

            renderSubsections: function() {

                if (!this.$el.find('.subsections').length) {
                    this.$el.append(_.template(
                        $('#template-lines').html()
                    )());
                } else {
                    this.$el.find('.subsections').html('');
                }

                var subsectionView;

                this.model.get('subsections').each(function(subsection) {

                    subsectionView = new SubsectionView({
                        model: subsection
                    });

                    subsectionView.render().$el.insertBefore(
                        this.$el.find('.line-add')
                    );

                });

            },

            moveUp: function() {

                this.$el.after(this.$el.prev());

                var this_section_number = this.model.get('number');

                var prev_section = this.model.collection.find(
                    function(section) {
                        return section.get('number') == this_section_number - 1;
                    }
                );

                var prev_section_number = prev_section.get('number');
                prev_section.set('number', this_section_number);
                this.model.set('number', prev_section_number);

                this.model.trigger('change:alt_name');
                prev_section.trigger('change:alt_name');

                this.model.save();
                prev_section.save();

            },

            moveDown: function() {

                this.$el.before(this.$el.next());

                var this_section_number = this.model.get('number');

                var next_section = this.model.collection.find(
                    function(section) {
                        return section.get('number') == this_section_number + 1;
                    }
                );

                var next_section_number = next_section.get('number');
                next_section.set('number', this_section_number);
                this.model.set('number', next_section_number);

                this.model.trigger('change:alt_name');
                next_section.trigger('change:alt_name');

                this.model.save();
                next_section.save();

            },

            removeSection: function() {

                if (confirm("Are you sure you want to remove this section?")) {
                    this.model.destroy();
                    this.remove();
                }

            },

        });

    }
);
