define(
    ['models/measure', 'views/chord', 'init/measure_edit'],
    function(Measure, ChordView, measureEdit) {

        return Backbone.View.extend({

            tagName: 'td',
            className: 'measure',
            model: Measure,

            initialize: function() {

                if(!this.$el.find('.chords').length) {
                    this.$el.html('<div class="chords"></div>')
                }
                this.chords = this.$el.find('.chords')

                this.listenTo(this.model, 'change', this.render)
                this.listenTo(this.model, 'destroy', this.remove)

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

                // If the measure edit widget is already open for this measure
                // then close it, otherwise open it.
                if(
                    measureEdit.get('visible') &&
                    measureEdit.get('measure') == this.model
                ) {
                    measureEdit.set('visible', false)
                }
                else {
                    measureEdit.set({
                        'visible': true,
                        'measure': this.model,
                        'measure_el': this.$el,
                        'beat_schema': this.model.get('beat_schema')
                    })
                }

            },

            render: function() {
                this.chords.html('')
                this.drawChords()
                this.drawSeperationLines()
                return this
            },

            drawChords: function() {

                this.$el.removeClass('measure-beatschema-' +
                    this.model.previousAttributes().beat_schema)
                this.$el.addClass('measure-beatschema-' + 
                    this.model.get('beat_schema'))

                var that = this
                var beats = this.model.get('beat_schema').split('-')

                _.each(beats, function(chord, i) {

                    that.chords.append(
                        new ChordView({
                            model: that.model.get('chords').at(i)
                        }).render().el
                    )

                })

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

                        this.chords.prepend(canvas)

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

                        this.chords.prepend(canvas)

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

                        this.chords.prepend(canvas)

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

                        this.chords.prepend(canvas)

                        break

                }

            }

        })

    }
)
