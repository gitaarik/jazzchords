define(
    [],
    function() {

        return Backbone.View.extend({

            className: 'section',

            drawIndicatorLines: function() {
                // Draws the lines that indicate the start and end of a section

                if(this.model.get('alt_title')) {
                    // no lines needed for sections with an alternative title
                    return
                }

                var canvas = document.createElement('canvas')
                var context = canvas.getContext('2d')
                var line_margin = 0.15
                var section_sidebar_width = this.model.get('chart').get(
                    'section_sidebar_width')
                var box_height = this.model.get('chart').get('box_height')
                var section_height = this.model.get('height')

                canvas.style.position = 'absolute'
                canvas.width = section_sidebar_width
                canvas.height = section_height

                context.lineWidth = this.model.get('chart').get('border_width')

                // from top to title
                context.beginPath()
                context.moveTo(
                    section_sidebar_width / 2,
                    Math.round(box_height * line_margin))
                context.lineTo(section_sidebar_width / 2,
                    ((section_height / 2) - 5
                     - Math.round(box_height * line_margin)))
                context.stroke()

                // from title to bottom
                context.beginPath()
                context.moveTo(
                    section_sidebar_width / 2,
                    (section_height / 2) + 5
                    + Math.round(box_height * line_margin))
                context.lineTo(
                    section_sidebar_width / 2,
                    (section_height
                     - Math.round(box_height * line_margin)))
                context.stroke()

                // from top to right
                context.beginPath()
                context.moveTo(
                    section_sidebar_width / 2,
                    Math.round(box_height * line_margin))
                context.lineTo(
                    section_sidebar_width - 5,
                    Math.round(box_height * line_margin))
                context.stroke()

                // from bottom to right
                context.beginPath()
                context.moveTo(
                    section_sidebar_width / 2 ,
                    (section_height -
                     Math.round(box_height * line_margin)))
                context.lineTo(
                    section_sidebar_width - 5,
                    (section_height -
                     Math.round(box_height * line_margin)))
                context.stroke()

                this.$el.find('.section-sidebar').append(canvas)

            }

        })

    }
)
