define(
    ['models/chord', 'init/chord_edit'],
    function(Chord, chordEdit) {

        return Backbone.View.extend({

            model: Chord,
            className: 'chord',

            initialize: function() {
                this.listenTo(this.model, 'change', this.render)
            },

            events: {
                'click .chord-name': 'openChordEdit'
            },

            openChordEdit: function() {
                // Opens the edit widget for this chord

                chordEdit.set({
                    visible: true,
                    chord: this.model,
                    chord_view: this,
                    offset: this.$el.find('.chord-name').offset()
                })

            },

            chartOutput: function() {
                // Returns the string that should be outputted on the chart. This
                // is usually the chordName but in some cases the repeat sign ( % )

                // If this chord and the previous chord's measure_schema are both '4'
                // and are on the same line and had the same chord, use the repeat
                // sign ( % ). Otherwise use the chordName.

                if(
                    this.model.get('beats') == 4 &&
                    this.model.get('measure').has('prev_measure') &&
                    this.model.get('measure').get('line') == this.model.get('measure')
                        .get('prev_measure').get('line') &&
                    this.model.get('measure').get('prev_measure')
                        .get('beat_schema') == '4' &&
                    this.model.get('measure').get('prev_measure').get('chords')
                    .first().chordName() == this.model.chordName()
                ) {
                    return '%'
                }
                else {
                    return this.model.chordName()
                }

            },

            render: function() {

                if(!this.model.get('measure')) {
                    // only parse next measure if whole chart has been done parsing
                    return
                }

                this.$el.addClass('chord-' + this.model.get('order'))

                this.$el.html(
                    '<span class="chord-name">' + 
                        this.chartOutput() +
                    '</span>'
                )

                return this

            }

        })

    }
)
