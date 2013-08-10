define(
    ['models/chord_type'],
    function(ChordType) {

        return Backbone.Model.extend({

            initialize: function(attributes) {
                this.set('chord_type', new ChordType(this.get('chord_type')))
                this.listenTo(this, 'change', this.parse_next_measure)
            },

            parse_next_measure: function() {
                // Parses the next measure based on this measure
                //
                // If this and the next measure are on the same line and both
                // have beat_schema '4' then:
                // - If the chords are the same NOW, then next measure will
                //   display the repeat sign ( % ).
                // - If the chord before the change of this measure and the
                //   next chord were the same, then change the chord of the
                //   next measure to the chord of the current measure.

                if(
                    this.get('beats') == 4 &&
                    this.get('measure').has('next_measure') &&
                    this.get('measure').get('next_measure').get('beat_schema') == '4' &&
                    this.get('measure').get('line') == this.get('measure').get('next_measure').get('line')
                ) {

                    var next_chord = this.get('measure').get('next_measure')
                        .get('chords').first()

                    if(
                        // Check if chords are the same NOW
                        _.isEqual(next_chord.get('note'), this.get('note')) &&
                        _.isEqual(next_chord.get('chord_type').attributes,
                            this.get('chord_type').attributes) &&
                        _.isEqual(next_chord.get('alt_bass_note'),
                            this.get('alt_bass_note'))
                    ) {
                        // Trigger the `render()` by setting timestamp in
                        // milliseconds in `changed` attribute. Then `render()`
                        // will put the repeat sign ( % ) in.
                        this.get('measure').get('next_measure').get('chords').first()
                            .set('changed', new Date().getTime())
                    }
                    else {

                        var prev_attr = this.previousAttributes()

                        if(
                            // Check if the current measure's chord before the change
                            // is the same as the next measure's chord
                            _.isEqual(next_chord.get('note'), prev_attr.note) &&
                            _.isEqual(next_chord.get('chord_type').attributes,
                                prev_attr.chord_type.attributes) &&
                            _.isEqual(next_chord.get('alt_bass_note'),
                                prev_attr.alt_bass_note)
                        ) {
                            next_chord.set({
                                'note': this.get('note'),
                                'chord_type': this.get('chord_type'),
                                'alt_bass_note': this.get('alt_bass_note')
                            })
                        }

                    }

                }

            },

            chordName: function() {
                // Returns the full chord name

                var bass_note
                if(this.get('alt_bass_note')) {
                    bass_note = '/' + this.get('alt_bass_note').name
                }
                else {
                    bass_note = ''
                }

                return this.get('note').name +
                    this.get('chord_type').get('chord_output') + bass_note

            }

        })

    }
)
