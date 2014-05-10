define(
    [],
    function() {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'subsection_sidebar',

            render: function() {

                this.$el.html('');

                this.$el.height(this.model.get('subsection').height());

                this.redrawIndicatorLines();

                return this;

            },

            redrawIndicatorLines: function() {

                console.warn('TODO');
                return;

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

            }

        });

    }
);
