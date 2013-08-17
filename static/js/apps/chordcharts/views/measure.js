define(
    ['models/measure', 'views/chord', 'init/measure_edit'],
    function(Measure, ChordView, measureEdit) {

        return Backbone.View.extend({

            className: 'measure',
            model: Measure,

            initialize: function() {
                this.listenTo(this.model, 'change', this.render)
            },

            events: {
                'click': 'openMeasureEdit'
            },

            openMeasureEdit: function(event) {

                if($(event.target).closest('.chord-name').length) {
                    // If the click was on a chord name, the chord edit widget
                    // should open and not the measure edit widget.
                    return
                }

                measureEdit.set({
                    'visible': true,
                    'measure': this.model,
                    'measure_view': this,
                    'beat_schema': this.model.get('beat_schema')
                })

            },

            render: function() {
                this.$el.html('')
                this.drawChords()
                this.drawSeperationLines()
            },

            drawChords: function() {

                var number_chords

                switch(this.model.get('beat_schema')) {

                    case '4':
                        number_chords = 1
                        break

                    case '2-2':
                        number_chords = 2
                        break

                    case '2-1-1':
                    case '1-1-2':
                        number_chords = 3
                        break

                    case '1-1-1-1':
                        number_chords = 4
                        break

                }

                this.$el.removeClass('measure-beatschema-' +
                    this.model.previousAttributes().beat_schema)
                this.$el.addClass('measure-beatschema-' + 
                    this.model.get('beat_schema'))

                for(var i = 0; i < number_chords; i++) {

                    var chord = this.model.get('chords').at(i)
                    if(!chord) {
                        chord = last_chord
                    }
                    else {
                        var last_chord = chord
                    }

                    this.$el.append(
                        new ChordView({
                            model: chord
                        }).render().el
                    )

                }

            },

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

                    case '1-1-2':

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
                        context.moveTo(0, 0)
                        context.lineTo(box_width / 2, box_height / 2)
                        context.stroke()

                        this.$el.prepend(canvas)

                        break

                    case '1-1-1-1':

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
                        context.moveTo(0, 0)
                        context.lineTo(box_width, box_height)
                        context.stroke()

                        this.$el.prepend(canvas)

                        break

                }

            }

        })

    }
)
