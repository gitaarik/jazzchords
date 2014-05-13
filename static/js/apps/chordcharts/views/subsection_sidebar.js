define(
    [],
    function() {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'subsection_sidebar',

            initListeners: function() {
                this.stopListening();
                this.listenTo(this.model, 'change', this.render);
            },

            render: function() {

                var section_sidebar_template = _.template(
                    $('#template-subsection-sidebar').html()
                );

                this.$el.html(section_sidebar_template({
                    letter: this.model.get('subsection').letter(),
                    height: this.model.get('subsection').height(),
                }));

                this.renderIndicatorLines();

                return this;

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

            }

        });

    }
);
