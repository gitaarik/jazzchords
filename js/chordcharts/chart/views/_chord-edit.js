var ChordEditNotes = require('../collections/_chord-edit-notes.js');
var ChordEditChordTypes = require('../collections/_chord-edit-chord-types.js');
var ChordEdit = require('../models/_chord-edit.js');
var ChordEditNote = require('../models/_chord-edit-note.js');
var chordTypes = require('../init/_chord-types.js');
var allKeys = require('../../../core/widgets/_all-keys.js');
var ChordEditNoteView = require('./_chord-edit-note.js');
var ChordEditChordTypeView = require('./_chord-edit-chord-type.js');


module.exports = Backbone.View.extend({

    model: ChordEdit,

    events: {
        'click header .close': 'close',
        'click .tabs li': 'switchTab',
        'click .chord-settings .setting.chord-note .rest': 'useAsRest',
        'click .chord-settings .setting.type .toggle': 'toggleChordTypes',
        'click .chord-settings .setting.alt-bass-note .none': 'noAltBass'
    },

    initialize: function() {
        this.chord_type_el = this.$el.find('.chord-settings .setting.type');
        this.initChordTypes();
        this.listenTo(this.model, 'change', this.render);
    },

    render: function() {

        // Only show the edit widget when 'visible' is true, otherwise, hide
        // the edit widget.

        if (this.model.get('visible')) {

            var previousAttributes = this.model.previousAttributes();

            // If the edit widget was already open for this chord, then
            // apparently something else than the visibility changed, so we
            // apply the changes. Else, we reset the widget to it's initial
            // state.
            if (
                previousAttributes.visible &&
                this.model.get('chord') == previousAttributes.chord
            ) {
                this.applyChanges();
            } else {
                this.reset();
            }

            this.show();

        } else {
            this.$el.hide();
        }

        return this;

    },

    initChordTypes: function() {
        // Creates the views for the chord type choices and binds them to the
        // existing HTML

        var that = this;
        this.chordEditChordTypes = new ChordEditChordTypes();

        chordTypes.each(function(chord_type) {
            that.chordEditChordTypes.add({
                chord_type: chord_type
            });
        });

        var number = 0;
        var chordEditChordType;

        this.chord_type_el.find('li').each(function() {

            chordEditChordType = that.chordEditChordTypes.models[number];
            chordEditChordType.set('editWidget', that.model);

            new ChordEditChordTypeView({
                el: this,
                model: chordEditChordType
            });

            number++;

        });

    },

    applyChanges: function() {
        // Applies the changes made in the edit widget to the chord

        var chordNote = Boolean(this.model.get('chord_note'));
        var alt_bass_note = this.model.get('alt_bass_note');

        var chord_data = {
            chord_type_id: this.model.get('chord_type').get('id'),
            rest: !chordNote
        };

        if (chordNote) {
            chord_data.chord_pitch = this.model.get('chord_note').get('distance_from_root');
            chord_data.chord_note_alt_notation = this.model.get('chord_note_alt_notation');
        }

        if (alt_bass_note) {
            chord_data.alt_bass = true;
            chord_data.alt_bass_pitch = (
                this.model.get('alt_bass_note').get('distance_from_root')
            );
            chord_data.alt_bass_note_alt_notation = (
                this.model.get('alt_bass_note_alt_notation')
            );
        } else {
            chord_data.alt_bass = false;
        }

        var chord = this.model.get('chord');
        chord.set(chord_data);
        chord.save();
        chord.get('measure').parseNextMeasure();

    },

    close: function() {
        this.model.set('visible', false);
    },

    switchTab: function(obj) {
        // Switches to a tab in the edit widget like 'note', 'type' and
        // 'alt_bass_bass'.
        var tab = $(obj.currentTarget);
        this.openTab(tab.data('key'));
    },

    openTab: function(key) {
        // Opens tab matching provided key

        this.$el.find('.tabs li').removeClass('active')
            .parent().find('li[data-key=' + key + ']')
            .addClass('active');

        this.$el.find('.chord-settings .setting').hide().parent().find(
            '.setting[data-key=' + key + ']'
        ).show();

    },

    /**
     * Sets this chord to be used as a rest.
     */
    useAsRest: function() {
        this.model.set('chord_note', false);
    },

    /**
     * Toggles between the two pages of chord type options
     */
    toggleChordTypes: function(obj) {

        if (this.chord_type_el.find('.type-part-1').is(':visible')) {
            this.showChordTypePart(2);
        } else {
            this.showChordTypePart(1);
        }

    },

    noAltBass: function() {
        this.model.set('alt_bass_note', false);
    },

    showChordTypePart: function(number) {
        // Shows the chord type part of the provided number The chord type
        // choices are in these parts
        this.chord_type_el.find('.type-part').hide();
        this.chord_type_el.find('.type-part-' + number).show();
    },

    /**
     * Parses the settings on the model and render the html accordingly
     */
    show: function() {

        var offset = this.offset();

        this.$el.css({
            'top': this.model.get('offset').top + offset.top,
            'left': this.model.get('offset').left + offset.left
        });

        this.parseNoteChoiceWidgets();
        this.parseChordTypeWidget();

        this.$el.show();

    },

    offset: function() {
        // Get the offset for the edit widget based on the chord it was opened
        // for.

        var beat_schema = this.model.get('chord')
            .get('measure').get('beat_schema');

        var off_top;
        var off_left;

        switch(beat_schema) {

            case '4':
                off_top = 85;
                off_left = -10;
                break;

            case '2-2':
                off_top = 60;
                off_left = -29;
                break;

            case '2-1-1':

                switch(this.model.get('chord').get('number')) {

                    case 1:
                        off_top = 60;
                        off_left = -29;
                        break;

                    case 2:
                        off_top = 47;
                        off_left = -9;
                        break;

                    case 3:
                        off_top = 77;
                        off_left = -39;
                        break;

                }

                break;

            case '1-1-2':

                switch(this.model.get('chord').get('number')) {

                    case 1:
                        off_top = 77;
                        off_left = -39;
                        break;

                    case 2:
                        off_top = 47;
                        off_left = -9;
                        break;

                    case 3:
                        off_top = 60;
                        off_left = -29;
                        break;

                }

                break;

            case '1-1-1-1':

                switch(this.model.get('chord').get('number')) {

                    case 1:
                        off_top = 77;
                        off_left = -39;
                        break;

                    case 2:
                        off_top = 47;
                        off_left = -9;
                        break;

                    case 3:
                        off_top = 47;
                        off_left = -9;
                        break;

                    case 4:
                        off_top = 77;
                        off_left = -39;
                        break;

                }

                break;

        }

        return {
            top: off_top,
            left: off_left
        };

    },

    /**
     * Parses the note and the alt bass note choice widgets.
     */
    parseNoteChoiceWidgets: function() {

        var that = this;
        var noteTypes = ['chord_note', 'alt_bass_note'];

        // If the notes are different from the last time, regenerate the
        // models/views.
        if (
            this.model.get('note_choices') !=
            this.model.previousAttributes().note_choices
        ) {

            that.editWidgetNotes = [];

            _.each(noteTypes, function(noteType) {

                that.editWidgetNotes[noteType] = new ChordEditNotes();
                var chordEditNote;
                var noteChoices = that.$el.find(
                    '.chord-settings ' +
                    '.setting[data-key=' + noteType + '] ul'
                );
                noteChoices.html('');

                that.model.get('note_choices').each(function(note) {

                    chordEditNote = new ChordEditNote({
                        note_id: note.get('id'), // used for `findWhere` later on
                        note: note,
                        note_type: noteType,
                        editWidget: that.model
                    });

                    that.editWidgetNotes[noteType].add(chordEditNote);

                    noteChoices.append(
                        new ChordEditNoteView({
                            model: chordEditNote
                        }).render().el
                    );

                });

            });

        }

        // Select the correct note
        _.each(noteTypes, function(noteType) {

            // Deselect last selected if it exists
            var currentSelected = (
                that.editWidgetNotes[noteType]
                .findWhere({ selected: true })
            );

            if (currentSelected) {
                currentSelected.set('selected', false);
            }

            // Select note if it is set (bass note doesn't have to be set)

            var deselectButton = that.$el.find(
                '.chord-settings ' +
                '.setting[data-key=' + noteType + '] .deselect'
            );

            if (that.model.get(noteType)) {

                if (deselectButton) {
                    deselectButton.removeClass('selected');
                }

                var useAltNotation;

                if (noteType == 'chord_note') {
                    useAltNotation = that.model.get('chord').get('chord_note_alt_notation')
                } else {
                    useAltNotation = that.model.get('chord').get('alt_bass_note_alt_notation')
                }

                that.editWidgetNotes[noteType].findWhere({
                    note_id: that.model.get(noteType).get('id')
                }).set({
                    'selected': true,
                    'use_alt_notation': useAltNotation
                });

            } else if (deselectButton) {
                deselectButton.addClass('selected');
            }

        });

    },

    /**
     * Parses the chord type widget.
     */
    parseChordTypeWidget: function() {

        var that = this;
        var currentSelected = this.chordEditChordTypes.findWhere({
            selected: true
        });

        if (currentSelected) {
            currentSelected.set('selected', false);
        }

        this.chordEditChordTypes.find(function(chordEditChordType) {
            return (
                chordEditChordType.get('chord_type').get('id') ==
                that.model.get('chord_type').get('id')
            );
        }).set('selected', true);

    },

    /**
     * Resets the edit widget to the "start state".
     *
     * For example, the notes get reinitialized with the notes from the correct
     * key, the chosen chord is the chord the edit is on and the selected tab
     * is the note tab.
     */
    reset: function() {

        var chord = this.model.get('chord');
        var chordNote;
        var chordNoteAltNotation = false;
        var altBass = chord.get('alt_bass');
        var altBassNote;
        var altBassNoteAltNotation = false;
        var rest = chord.get('rest');

        if (rest) {
            chordNote = false;
        } else {
            chordNote = chord.getNote();
            chordNoteAltNotation = chord.get('chord_note_alt_notation')
        }

        if (altBass) {
            altBassNote = chord.getAltBassNote();
            altBassNoteAltNotation = chord.get('alt_bass_note_alt_notation');
        } else {
            altBassNote = false;
        }

        this.model.set({
            chord_note: chordNote,
            chord_note_alt_notation: chordNoteAltNotation,
            chord_type: chord.get('chord_type'),
            alt_bass_note: altBassNote,
            alt_bass_note_alt_notation: altBassNoteAltNotation,
            rest: rest,
            note_choices: (
                allKeys.findWhere({
                    id: chord.getKey().get('id')
                }).get('notes')
            )
        });

        // Show the chord type part that has the curent selected chord type
        var current_chord_type = this.chordEditChordTypes.findWhere({
            chord_type: this.model.get('chord_type')
        });

        if (this.chordEditChordTypes.indexOf(current_chord_type) > 11) {
            this.showChordTypePart(2);
        } else {
            this.showChordTypePart(1);
        }

        this.openTab('chord_note');

    }

});
