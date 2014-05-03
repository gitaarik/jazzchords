define(
    ['models/note', 'models/chord_type', 'init/all_keys'],
    function(Note, ChordType, allKeys) {

        return Backbone.Model.extend({

            initialize: function(attributes) {
                this.initData();
                this.initListeners();
            },

            initData: function() {

                if (!this.has('chord_type')) {

                    var that = this;

                    _.each(GLOBALS.chord_types, function(chord_type_data) {
                        if (chord_type_data.id == that.get('chord_type_id')) {
                            that.set('chord_type', new ChordType(chord_type_data));
                        }
                    });

                }

                if (!this.get('key')) {
                    this.initKey();
                }

            },

            initListeners: function() {
                this.stopListening();
                this.listenTo(this, 'change', this.parseNextMeasure);
                this.listenTo(this, 'change:key_id', this.initKey);
                this.listenTo(this, 'change:chord_pitch', this.initNote);
                this.listenTo(this, 'change:alt_bass_pitch', this.initAltBassNote);
            },

            initKey: function() {
                this.set('key', allKeys.get(this.get('key_id')));
                this.initNote();
                this.initAltBassNote();
            },

            initNote: function() {
                this.set(
                    'note',
                    this.get('key').note(this.get('chord_pitch'))
                );
            },

            initAltBassNote: function() {

                var alt_bass_note;

                if (this.get('alt_bass')) {
                    alt_bass_note = this.get('key').note(this.get('alt_bass_pitch'));
                } else {
                    alt_bass_note = false;
                }

                this.set('alt_bass_note', alt_bass_note);

            },

            parseNextMeasure: function() {
                // Parses the next measure based on this measure
                //
                // If this and the next measure are on the same line and both
                // have beat_schema '4' then:
                // - If the chords are the same NOW, then next measure will
                //   display the repeat sign ( % ).
                // - If the chord before the change of this measure and the
                //   next chord were the same, then change the chord of the
                //   next measure to the chord of the current measure.

                if (!this.get('measure').get('line').get('section').get('chart').get('parsed')) {
                    // only parse next measure if whole chart has been done parsing
                    return;
                }

                if (
                    this.get('beats') == 4 &&
                    this.get('measure').has('next_measure') &&
                    this.get('measure').get('next_measure').get('beat_schema') == '4' &&
                    this.get('measure').get('line') == this.get('measure').get('next_measure').get('line')
                ) {

                    var next_chord = this.get('measure').get('next_measure')
                        .get('chords').first();

                    if (
                        // Check if chords are the same NOW
                        next_chord.get('chord_pitch') == this.get('chord_pitch') &&
                        _.isEqual(
                            next_chord.get('chord_type').attributes,
                            this.get('chord_type').attributes
                        ) &&
                        (
                            (!next_chord.get('alt_bass') && !this.get('alt_bass')) ||
                            (
                                next_chord.get('alt_bass') && this.get('alt_bass') &&
                                next_chord.get('alt_bass_pitch') == this.get('alt_bass_pitch')
                            )
                        )
                    ) {
                        console.log('jaojaojao');
                        // Trigger the `render()` by setting timestamp in
                        // milliseconds in `changed` attribute. Then `render()`
                        // will put the repeat sign ( % ) in.
                        this.get('measure').get('next_measure').get('chords').first()
                            .set('changed', new Date().getTime());
                    }
                    else {

                        var prev_attr = this.previousAttributes();

                        if (
                            // Check if the current measure's chord before the change
                            // is the same as the next measure's chord
                            _.isEqual(
                                next_chord.get('chord_pitch'),
                                prev_attr.chord_pitch
                            ) && _.isEqual(
                                next_chord.get('chord_type').attributes,
                                prev_attr.chord_type.attributes
                            ) && (
                                (
                                    !next_chord.get('alt_bass') &&
                                    !prev_attr.alt_bass
                                ) || (
                                    next_chord.get('alt_bass') &&
                                    prev_attr.alt_bass &&
                                    _.isEqual(
                                        next_chord.get('alt_bass_pitch'),
                                        prev_attr.alt_bass_pitch
                                    )
                                )
                            )
                        ) {
                            next_chord.set({
                                'chord_pitch': this.get('chord_pitch'),
                                'chord_type': this.get('chord_type'),
                                'alt_bass': this.get('alt_bass'),
                                'alt_bass_pitch': this.get('alt_bass_pitch')
                            });
                        }

                    }

                }

            },

            chordName: function() {
                // Returns the full chord name

                var bass_note;

                if (this.get('alt_bass')) {
                    bass_note = '/' + this.get('alt_bass_note').get('name');
                } else {
                    bass_note = '';
                }

                return (
                    this.get('note').get('name') +
                    this.get('chord_type').get('chord_output') +
                    bass_note
                );

            },

            copy: function(attributes) {

                var copy = this.clone();
                copy.set({
                    id: null
                });

                if (attributes) {
                    copy.set(attributes);
                }

                copy.initListeners();

                return copy;

            },

            toJSON: function() {
                return {
                    order: this.get('order'),
                    beats: this.get('beats'),
                    alt_bass_pitch: this.get('alt_bass_pitch'),
                    chord_type: this.get('chord_type').get('id'),
                };
            }

        });

    }
);
