define(
    ['models/measure'],
    function(Measure) {

        return Backbone.View.extend({

            className: 'measure',
            model: Measure,

            drawSeperationLines: function() {
                // Draws the lines that seperate the different measure parts
                // inside the measure

                var chart = this.model.get('line').get('section').get('chart')
                var box_width = chart.get('box_width')
                var box_height = chart.get('box_height')
                var border_width = chart.get('border_width')

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
