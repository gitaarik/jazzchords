define(
    ['models/measure_edit_measure'],
    function(MeasureEditMeasure) {

        return Backbone.View.extend({

            model: MeasureEditMeasure,
            tagName: 'li',

            initialize: function() {
                this.listenTo(this.model, 'change', this.render)
            },

            events: {
                'click': 'chooseMeasure'
            },

            chooseMeasure: function() {
                this.model.get('measureEdit').set('beat_schema',
                    this.model.get('beat_schema'))
            },

            render: function() {

                if(!this.measures_drawn) {
                    this.drawMeasures()
                    this.measures_drawn = true
                }

                if(this.model.get('selected')) {
                    this.$el.find('.measure').addClass('selected')
                }
                else {
                    this.$el.find('.measure').removeClass('selected')
                }

                return this

            },

            drawMeasures: function() {

                var template = _.template(
                    $('#template-measure-edit-measure').html()
                )

                var num_chords

                switch(this.model.get('beat_schema')) {

                    case '4':
                        num_chords = 1
                        break

                    case '2-2':
                        num_chords = 2
                        break

                    case '2-1-1':
                    case '1-1-2':
                        num_chords = 3
                        break

                    case '1-1-1-1':
                        num_chords = 4
                        break

                }

                this.$el.html(
                    template({
                        beat_schema: this.model.get('beat_schema'),
                        num_chords: num_chords
                    })
                )

                this.drawSeperationLines()

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
