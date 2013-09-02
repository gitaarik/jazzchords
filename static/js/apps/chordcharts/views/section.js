define(
    ['models/line', 'views/line'],
    function(Line, LineView) {

        return Backbone.View.extend({

            className: 'section',

            events: {
                'click .section-header .section-edit .remove': 'removeSection',
                'click .line-add .plus': 'addLine'
            },

            addLine: function() {

                var line = this.model.get('lines').last().copy()

                this.model.get('lines').add(line)

                var lineView = new LineView({
                    model: line
                })

                lineView.render().$el.insertBefore(this.$el.find('.line-add'))

                this.model.recalculateHeight()
                this.render()

            },

            render: function() {

                this.$el.find('.section-sidebar-title').css(
                    'line-height',
                    this.model.get('height') + 'px'
                )
                this.redrawIndicatorLines()

            },

            redrawIndicatorLines: function() {
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

                this.$el.find('.section-sidebar canvas').remove()
                this.$el.find('.section-sidebar').append(canvas)

            },

            removeSection: function() {

                if(confirm("Are you sure you want to remove this section?")) {

                    //this.model.remove()
                    this.remove()

                }

            }

        })

    }
)
