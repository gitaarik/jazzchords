define(
    ['models/box'],
    function(Box) {

        return Backbone.View.extend({

            className: 'box',
            model: Box,

            drawSeperationLines: function() {
                // Draws the lines that seperate the different box parts inside
                // the box

                switch(this.model.get('beat_schema')) {

                    case '2-2':

                        var canvas = document.createElement('canvas')
                        var context = canvas.getContext('2d')

                        canvas.style.position = 'absolute'
                        canvas.width = settings.box_width 
                        canvas.height = settings.box_height 

                        context.lineWidth = settings.border_width 

                        context.beginPath()
                        context.moveTo(settings.box_width, 0)
                        context.lineTo(0, settings.box_height)
                        context.stroke()

                        this.$el.prepend(canvas)

                        break

                    case '2-1-1':

                        var canvas = document.createElement('canvas')
                        var context = canvas.getContext('2d')

                        canvas.style.position = 'absolute'
                        canvas.width = settings.box_width 
                        canvas.height = settings.box_height

                        context.lineWidth = settings.border_width 

                        context.beginPath()
                        context.moveTo(settings.box_width, 0)
                        context.lineTo(0, settings.box_height)
                        context.stroke()

                        context.beginPath()
                        context.moveTo(settings.box_width / 2, settings.box_height / 2)
                        context.lineTo(settings.box_width, settings.box_height)
                        context.stroke()

                        this.$el.prepend(canvas)

                        break

                }

            }

        })

    }
)
