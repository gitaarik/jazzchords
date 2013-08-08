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
                var measure_width = chart.measure_width
                var measure_height = chart.measure_height
                var border_width = chart.border_width

                switch(this.model.get('beat_schema')) {

                    case '2-2':

                        var canvas = document.createElement('canvas')
                        var context = canvas.getContext('2d')

                        canvas.style.position = 'absolute'
                        canvas.width = measure_width 
                        canvas.height = measure_height 

                        context.lineWidth = border_width 

                        context.beginPath()
                        context.moveTo(measure_width, 0)
                        context.lineTo(0, measure_height)
                        context.stroke()

                        this.$el.prepend(canvas)

                        break

                    case '2-1-1':

                        var canvas = document.createElement('canvas')
                        var context = canvas.getContext('2d')

                        canvas.style.position = 'absolute'
                        canvas.width = measure_width 
                        canvas.height = measure_height

                        context.lineWidth = border_width 

                        context.beginPath()
                        context.moveTo(measure_width, 0)
                        context.lineTo(0, measure_height)
                        context.stroke()

                        context.beginPath()
                        context.moveTo(measure_width / 2, measure_height / 2)
                        context.lineTo(measure_width, measure_height)
                        context.stroke()

                        this.$el.prepend(canvas)

                        break

                }

            }

        })

    }
)
