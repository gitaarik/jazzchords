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
     * Returns the full chord name
     */
    chordName: function() {

        var noteNotation;

        if (this.get('chord_note_alt_notation')) {
            noteNotation = this.getNote().get('alt_name');
        } else {
            noteNotation = this.getNote().get('name');
        }

        var bassNote;

        if (this.get('alt_bass')) {

            var altBassNote = this.getAltBassNote();
            var altBassNoteNotation;

            if (this.get('alt_bass_note_alt_notation')) {
                altBassNoteNotation = altBassNote.get('alt_name');
            } else {
                altBassNoteNotation = altBassNote.get('name');
            }

            bassNote = '/' + altBassNoteNotation;

        } else {
            bassNote = '';
        }

        return (
            noteNotation +
            this.get('chord_type').get('chord_output') +
            bassNote
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

    isEqualTo: function(chord) {

        if (typeof chord.attributes != 'undefined') {
            chord = chord.attributes
        }

        return (
            this.get('chord_pitch') == chord.chord_pitch &&
            this.get('chord_note_alt_notation') == chord.chord_note_alt_notation &&
            _.isEqual(this.get('chord_type').attributes, chord.chord_type.attributes) &&
            (
                (!this.get('alt_bass') && !chord.alt_bass) ||
                (
                    this.get('alt_bass') && chord.alt_bass &&
                    this.get('alt_bass_pitch') == chord.alt_bass_pitch &&
                    this.get('alt_bass_note_alt_notation') == chord.alt_bass_note_alt_notation
                )
            )
        )

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
            chord_note_alt_notation: this.get('chord_note_alt_notation'),
            chord_type_id: this.get('chord_type').get('id'),
            alt_bass: this.get('alt_bass'),
            alt_bass_pitch: this.get('alt_bass_pitch'),
            alt_bass_note_alt_notation: this.get('alt_bass_note_alt_notation'),
            rest: this.get('rest'),
            number: this.get('number')
        };

    }

});
