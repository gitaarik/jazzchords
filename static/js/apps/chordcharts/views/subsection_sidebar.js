define(
    [
        'models/subsection_sidebar_part',
        'views/subsection_sidebar_part'
    ],
    function(
        SubsectionSidebarPart,
        SubsectionSidebarPartView
    ) {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'subsection-sidebar',

            initListeners: function() {
                this.stopListening();
                this.listenTo(this.model, 'change', this.render);
            },

            render: function() {

                this.$el.html('');

                if (this.model.get('edit')) {
                    this.renderEditView();
                } else {
                    this.renderNormalView();
                }

                return this;

            },

            renderNormalView: function() {
                this.addPart(false, false);
                this.renderIndicatorLines();
            },

            renderIndicatorLines: function() {

                var canvas = this.$el.find('canvas');
                var sidebar_width = GLOBALS.settings.section_sidebar_width;
                var sidebar_half_width = Math.round(sidebar_width / 2);
                var box_height = GLOBALS.settings.box_height;
                var line_margin = Math.round(box_height * 0.15);
                var subsection_height = this.model.get('subsection').height();
                var section_half_height = Math.round(subsection_height / 2);

                canvas[0].height = subsection_height;
                canvas[0].width = sidebar_width;
                var context = canvas[0].getContext('2d');

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
                    (subsection_height - line_margin)
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
                    (subsection_height - line_margin)
                );
                context.lineTo(
                    sidebar_width - 5,
                    (subsection_height - line_margin)
                );
                context.stroke();

            },

            renderEditView: function() {

                var that = this;

                this.model.get('subsection').get('lines').each(function(line) {
                    that.addPart(true, line);
                });

            },

            addPart: function(edit, line) {

                var subsectionSidebarPart = new SubsectionSidebarPart({
                    'subsection': this.model.get('subsection'),
                    'edit': edit,
                    'line': line
                });

                var subsectionSidebarPartView = new SubsectionSidebarPartView({
                    model: subsectionSidebarPart
                });

                this.$el.append(subsectionSidebarPartView.render().el);

            }

        });

    }
);
