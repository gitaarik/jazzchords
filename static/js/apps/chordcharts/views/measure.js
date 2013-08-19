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

                if(measureEdit.get('visible')) {
                    measureEdit.discardChanges()
                }

                measureEdit.set({
                    'visible': true,
                    'measure': this.model,
                    'measure_view': this,
                    'beat_schema': this.model.get('beat_schema')
                })

            },

            render: function() {
                this.drawChords()
                this.drawSeperationLines()
            },

            drawChords: function() {

                this.$el.removeClass('measure-beatschema-' +
                    this.model.previousAttributes().beat_schema)
                this.$el.addClass('measure-beatschema-' + 
                    this.model.get('beat_schema'))

                var that = this
                var beats_set = this.model.get('beat_schema').split('-')
                var last_chord
                var new_chord = false
                var new_chords = []
                var new_chord_views = []

                console.log(this.model.get('chord_views'))

                _.each(beats_set, function(beats, index) {

                    var chord = that.model.get('chords').at(index)

                    if(!chord) {
                        chord = last_chord.clone()
                        new_chord = true
                    }
                    else {
                        new_chord = false
                    }

                    chord.set({
                        beats: parseInt(beats),
                        order: index + 1
                    })

                    if(new_chord) {

                        new_chords.push(chord)

                        new_chord_views.push(
                            new ChordView({
                                model: chord
                            })
                        )

                    }

                    last_chord = chord

                })

                /*this.model.get('chords').reset(new_chords)
                this.model.set('chord_views', new_chord_views)*/

                console.log(new_chord_views)
                /*_.each(new_chord_views, function(chord_view) {
                    that.$el.append(chord_view.render().el)
                })*/

            },

            drawSeperationLines: function() {
                // Draws the lines that seperate the different measure parts
                // inside the measure

                this.$el.find('canvas').remove()

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
