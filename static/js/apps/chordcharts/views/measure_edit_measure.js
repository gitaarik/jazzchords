define(
    ['models/measure_edit_measure'],
    function(MeasureEditMeasure) {

        return Backbone.View.extend({

            model: MeasureEditMeasure,
            tagName: 'li',

            render: function() {

                this.$el.html(
                    '<div class="measure measure-beatschema-' +
                        this.model.get('beat_schema') +
                    '"></div>'
                )

                this.drawSeperationLines()

                return this

            },

            drawSeperationLines: function() {

                var element = this.$el.find('.measure')

                switch(this.model.get('beat_schema')) {

                    case '2-2':

                        var canvas = document.createElement('canvas')
                        var context = canvas.getContext('2d')

                        canvas.style.position = 'absolute'
                        canvas.width = 50
                        canvas.height = 50

                        context.lineWidth = 1

                        context.beginPath()
                        context.moveTo(50, 0)
                        context.lineTo(0, 50)
                        context.stroke()

                        element.prepend(canvas)

                        break

                    case '2-1-1':

                        var canvas = document.createElement('canvas')
                        var context = canvas.getContext('2d')

                        canvas.style.position = 'absolute'
                        canvas.width = 50
                        canvas.height = 50

                        context.lineWidth = 1

                        context.beginPath()
                        context.moveTo(50, 0)
                        context.lineTo(0, 50)
                        context.stroke()

                        context.beginPath()
                        context.moveTo(25, 25)
                        context.lineTo(50, 50)
                        context.stroke()

                        element.prepend(canvas)

                        break

                    case '1-1-2':

                        var canvas = document.createElement('canvas')
                        var context = canvas.getContext('2d')

                        canvas.style.position = 'absolute'
                        canvas.width = 50
                        canvas.height = 50

                        context.lineWidth = 1

                        context.beginPath()
                        context.moveTo(50, 0)
                        context.lineTo(0, 50)
                        context.stroke()

                        context.beginPath()
                        context.moveTo(0, 0)
                        context.lineTo(25, 25)
                        context.stroke()

                        element.prepend(canvas)

                        break

                    case '1-1-1-1':

                        var canvas = document.createElement('canvas')
                        var context = canvas.getContext('2d')

                        canvas.style.position = 'absolute'
                        canvas.width = 50
                        canvas.height = 50

                        context.lineWidth = 1

                        context.beginPath()
                        context.moveTo(50, 0)
                        context.lineTo(0, 50)
                        context.stroke()

                        context.beginPath()
                        context.moveTo(0, 0)
                        context.lineTo(50, 50)
                        context.stroke()

                        element.prepend(canvas)

                        break

                }

            }

        })

    }
)
