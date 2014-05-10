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

                this.$el.find('canvas').remove();

                var canvas = document.createElement('canvas');
                console.log(this.model.get('section'));
                var sidebar_width = this.model.get('section').get('chart')
                    .get('section_sidebar_width');
                var sidebar_half_width = Math.round(sidebar_width / 2);
                var box_height = this.model.get('section').get('chart')
                    .get('box_height');
                var line_margin = Math.round(box_height * 0.15);
                var subsection_height = this.model.get('subsection').height();
                var section_half_height = Math.round(subsection_height / 2);

                canvas.height = subsection_height;
                canvas.width = sidebar_width;
                $(canvas).css('height', subsection_height + 'px');
                var context = canvas.getContext('2d');

                context.lineWidth = this.model.get('section').get('chart')
                    .get('border_width');

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

                this.$el.append(canvas);

            }

        });

    }
);
