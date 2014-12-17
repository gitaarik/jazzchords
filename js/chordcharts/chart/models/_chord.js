var Model = require('../init/_model.js');
var chordTypes = require('../init/_chord-types.js');
var allKeys = require('../../../core/widgets/_all-keys.js');


module.exports = Model.extend({

    initialize: function(attributes) {
        this.initData();
        this.initListeners();
    },

    initData: function() {

        if (!this.has('chord_type')) {
            this.initChordType();
        }

        if (!this.getKey()) {
            this.initKey();
        }

    },

    initListeners: function() {
        this.stopListening();
        this.listenTo(this, 'change:chord_type_id', this.initChordType);
    },

    /**
     * Initializes the chord type based on the current
     * `chord_type_id`.
     */
    initChordType: function() {
        this.set(
            'chord_type',
            chordTypes.get(this.get('chord_type_id'))
        );
    },

    getNote: function() {
        return this.getKey().note(this.get('chord_pitch'));
    },

    getAltBassNote: function() {
        return this.getKey().note(this.get('alt_bass_pitch'));
    },

    getKey: function() {
        return this.get('measure').getKey();
    },

    /**
     * Parses the next measure based on this measure
     *
     * If this and the next measure are on the same line and both
     * have beat_schema '4' then:
     * - If the chords are the same NOW, then next measure will
     *   display the repeat sign ( % ).
     * - If the chord before the change of this measure and the
     *   next chord were the same, then change the chord of the
     *   next measure to the chord of the current measure.
     */
    parseNextMeasure: function() {

        if (!GLOBALS.parsed) {
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

                // Trigger the `render()` by setting timestamp in
                // milliseconds in `changed` attribute. Then `render()`
                // will put the repeat sign ( % ) in.
                this.get('measure').get('next_measure').get('chords').first()
                    .set('changed', new Date().getTime());

            } else {

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

                    next_chord.save();

                }

            }

        }

    },

    /**
     * Returns the full chord name
     */
    chordName: function() {

        var bass_note;

        if (this.get('alt_bass')) {
            bass_note = '/' + this.getAltBassNote().get('name');
        } else {
            bass_note = '';
        }

        return (
            this.getNote().get('name') +
            this.get('chord_type').get('chord_output') +
            bass_note
        );

    },

    /**
     * Returns the string that should be outputted on the chart. This
     * is usually the chordName but in some cases the repeat sign ( % )
     */
    chartOutput: function() {

        if (this.get('rest')) {
            return 'REST';
        }

        // If this chord and the previous chord's measure_schema are both '4'
        // and are on the same line and had the same chord, use the repeat
        // sign ( % ). Otherwise use the chordName.

        if (
            this.get('beats') == 4 &&
            this.get('measure').has('prev_measure') &&
            this.get('measure').get('line') == this.get('measure')
                .get('prev_measure').get('line') &&
            this.get('measure').get('prev_measure')
                .get('beat_schema') == '4' &&
            this.get('measure').get('prev_measure').get('chords')
            .first().chordName() == this.chordName()
        ) {
            return '%';
        } else {
            return this.chordName();
        }

    },

    copy: function(attributes) {

        var copy = this.clone();
        copy.set('id', null);

        if (attributes) {
            copy.set(attributes);
        }

        copy.initListeners();

        return copy;

    },

    toJSON: function() {

        return {
            beats: this.get('beats'),
            chord_pitch: this.get('chord_pitch'),
            chord_type_id: this.get('chord_type').get('id'),
            alt_bass: this.get('alt_bass'),
            alt_bass_pitch: this.get('alt_bass_pitch'),
            rest: this.get('rest'),
            number: this.get('number')
        };

    }

});
