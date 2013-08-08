define(
    ['models/box'],
    function(Box) {

        return Backbone.View.extend({

            className: 'box',
            model: Box,

            drawSeperationLines: function() {
                // Draws the lines that seperate the different box parts inside
                // the box

                var chart = this.model.get('line').get('section').get('chart')
                var box_width = chart.box_width
                var box_height = chart.box_height
                var border_width = chart.border_width

                switch(this.model.get('beat_schema')) {

                    case '2-2':

                        var canvas = document.createElement('canvas')
                        var context = canvas.getContext('2d')

                        canvas.style.position = 'absolute'
                        canvas.width = box_width 
                        canvas.height = box_height 

                        context.lineWidth = border_width 

                        context.beginPath()
                        context.moveTo(box_width, 0)
                        context.lineTo(0, box_height)
                        context.stroke()

                        this.$el.prepend(canvas)

                        break

                    case '2-1-1':

                        var canvas = document.createElement('canvas')
                        var context = canvas.getContext('2d')

                        canvas.style.position = 'absolute'
                        canvas.width = box_width 
                        canvas.height = box_height

                        context.lineWidth = border_width 

                        context.beginPath()
                        context.moveTo(box_width, 0)
                        context.lineTo(0, box_height)
                        context.stroke()

                        context.beginPath()
                        context.moveTo(box_width / 2, box_height / 2)
                        context.lineTo(box_width, box_height)
                        context.stroke()

                        this.$el.prepend(canvas)

                        break

                }

            }

        })

    }
)
