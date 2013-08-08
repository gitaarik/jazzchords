define(
    ['models/chord'],
    function(Chord) {

        return Backbone.View.extend({

            model: Chord,

            initialize: function() {
                this.listenTo(this.model, 'change', this.render)
            },

            events: {
                'click .chord-name': 'openEditWidget'
            },

            openEditWidget: function() {
                // Opens the edit widget for this chord

                var chord_name = this.$el.find('.chord-name')

                this.model.get('editWidget').set({
                    visible: true,
                    chord: this.model,
                    chord_name_offset: chord_name.offset(),
                    font_size: chord_name.css('font-size'),
                    letter_spacing: chord_name.css('letter-spacing')
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
                this.$el.find('.chord-name').html(this.chartOutput())
            }

        })

    }
)
