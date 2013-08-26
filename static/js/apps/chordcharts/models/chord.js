define(
    ['models/chord_type'],
    function(ChordType) {

        return Backbone.Model.extend({

            initialize: function(attributes) {

                // Only set chord_type if it hasn't been set yet. Prevents
                // errors when cloning.
                if(!(this.get('chord_type') instanceof Backbone.Model)) {
                    this.set('chord_type', new ChordType(this.get('chord_type')))
                }

                this.initPrevMeasureListener()
                this.listenTo(this.get('measure'), 'change', this.initPrevMeasureListener)
                this.listenTo(this.get('measure'), 'prevMeasureChanged', function() {
                    console.log('previous measure has changed!')
                })

            },

            initPrevMeasureListener: function() {
                // Initializes the listener that gets triggered when the
                // previous measure changes.

                // Stop previous listeners (if they were set).

                if(this.prev_measure) {

                    if(this.prev_measure_chord) {
                        this.stopListening(
                            this.prev_measure_chord,
                            'change',
                            this.parseBasedOnPrevMeasure
                        )
                    }

                    this.stopListening(this.prev_measure, 'remove')

                }

                this.prev_measure = this.get('measure').get('prev_measure')

                if(this.prev_measure) {

                    this.prev_measure_chord = this.prev_measure.get('chords').first()

                    this.listenTo(
                        this.prev_measure_chord,
                        'change',
                        this.parseBasedOnPrevMeasure
                    )

                    // When the previous measure gets removed and this measure
                    // was showing a repeat sign, this will rerender the view
                    // so the original chord will be shown instead.
                    this.listenTo(
                        this.prev_measure,
                        'remove',
                        function() {
                            this.trigger('change')
                        }
                    )

                }

            },

            parseBasedOnPrevMeasure: function() {
                // Parses the chord in this measure based on the chord in the
                // previous measure.
                //
                // This function should be triggered when this measure and the
                // previous measure are both beat schema "4" and the chord in
                // the previous measure has changed.
                // When the chords before the change were the same, we change
                // the chord in this measure too the new chord too. If they
                // became the same after the change, this measure will display
                // a repeat sign.

                if(
                    this.get('measure').get('beat_schema') == '4' &&
                    this.prev_measure &&
                    this.prev_measure.get('beat_schema') == '4'
                ) {

                    var chord = this.get('measure').get('prev_measure')
                        .get('chords').first()

                    if(
                        // Check if chords are the same NOW
                        _.isEqual(chord.get('note'), this.get('note')) &&
                        _.isEqual(chord.get('chord_type').attributes,
                            this.get('chord_type').attributes) &&
                        _.isEqual(chord.get('alt_bass_note'),
                            this.get('alt_bass_note'))
                    ) {
                        // If the chords are the same now, we should display a
                        // repeat sign in this measure, so we'll trigger a change
                        // event so the view will rerender.
                        this.trigger('change')
                    }
                    else {

                        var prev_attr = chord.previousAttributes()

                        if(
                            // Check if the previous measure's chord before the
                            // change is the same as this  measure's chord
                            _.isEqual(this.get('note'), prev_attr.note) &&
                            _.isEqual(this.get('chord_type').attributes,
                                prev_attr.chord_type.attributes) &&
                            _.isEqual(this.get('alt_bass_note'),
                                prev_attr.alt_bass_note)
                        ) {
                            this.set({
                                'note': chord.get('note'),
                                'chord_type': chord.get('chord_type'),
                                'alt_bass_note': chord.get('alt_bass_note')
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

            },

            copy: function(attributes) {

                var clone = this.clone()

                if(attributes) {
                    clone.set(attributes)
                }

                return clone

            }

        })

    }
)
