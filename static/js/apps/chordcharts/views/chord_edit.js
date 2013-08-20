define(
    [
        'collections/chord_edit_notes',
        'collections/chord_edit_chord_types',
        'models/chord_edit',
        'models/chord_edit_note',
        'views/chord_edit_note',
        'views/chord_edit_chord_type'
    ],
    function(
        ChordEditNotes,
        ChordEditChordTypes,
        ChordEdit,
        ChordEditNote,
        ChordEditNoteView,
        ChordEditChordTypeView
    ) {

        return Backbone.View.extend({

            model: ChordEdit,

            events: {
                'click header .close': 'close',
                'click .tabs li': 'switchTab',
                'click .chord-settings .setting[data-key=type] .toggle': 'toggleChordTypes',
                'click .chord-settings .setting[data-key=alt_bass_note] .none': 'noAltBass'
            },

            initialize: function() {
                this.chord_type = this.$el.find('.chord-settings .setting.type')
                this.initChordTypes()
                this.listenTo(this.model, 'change', this.change)
            },

            change: function() {

                // Only show the edit widget when 'visible' is true,
                // otherwise, hide the edit widget.

                if(this.model.get('visible')) {

                    var previousAttributes = this.model.previousAttributes()

                    // If the edit widget was already open for this chord,
                    // then apply the changes.
                    if(
                        previousAttributes.visible &&
                        this.model.get('chord') == previousAttributes.chord
                    ) {
                        this.applyChanges()
                    }

                    this.show()

                }
                else {
                    this.$el.hide()
                }

                return this

            },

            initChordTypes: function() {
                // Creates the views for the chord type choices and binds them to
                // the existing HTML

                var that = this
                this.editWidget_chordTypes = new ChordEditChordTypes()

                _.each(GLOBALS.chord_types, function(chord_type) {
                    that.editWidget_chordTypes.add({
                        chord_type_id: chord_type.id, // used for `findWhere` later on
                        chord_type: chord_type
                    })
                })

                var chordType_number = 0
                var chord_types = []

                this.chord_type.find('li').each(function() {

                    var chord_type_model = that.editWidget_chordTypes.models[chordType_number]
                    chord_type_model.set('editWidget', that.model)

                    new ChordEditChordTypeView({
                        el: this,
                        model: chord_type_model
                    })

                    chordType_number++

                })

            },

            applyChanges: function() {
                // Applies the changes made in the edit widget to the chord

                this.model.get('chord').set({
                    note: this.model.get('note'),
                    chord_type: this.model.get('chord_type'),
                    alt_bass_note: this.model.get('alt_bass_note')
                })

            },

            close: function() {
                this.model.set('visible', false)
            },

            switchTab: function(obj) {
                // Switches to a tab in the edit widget
                // like 'note', 'type' and 'alt_bass_bass'

                var tab = $(obj.currentTarget)
                this.openTab(tab.data('key'))

            },

            openTab: function(key) {
                // Opens tab matching provided key

                this.$el.find('.tabs li').removeClass('active')
                    .parent().find('li[data-key=' + key + ']')
                    .addClass('active')

                this.$el.find('.chord-settings .setting').hide().parent().find(
                    '.setting[data-key=' + key + ']').show()

            },

            toggleChordTypes: function(obj) {
                // Toggles between the two pages of chord type options

                if(this.chord_type.find('.type-part-1').is(':visible')) {
                    this.showChordTypePart(2)
                }
                else {
                    this.showChordTypePart(1)
                }

            },

            noAltBass: function() {
                this.model.set('alt_bass_note', false)
            },

            showChordTypePart: function(number) {
                // Shows the chord type part of the provided number
                // The chord type choices are in these parts
                this.chord_type.find('.type-part').hide()
                this.chord_type.find('.type-part-' + number).show()
            },

            show: function() {
                // Parses the settings on the model and render the html
                // accordingly

                // If the edit widget opens on a different chord than the
                // last one, then reset the editWidget.

                if(this.model.previousAttributes().chord !=
                   this.model.get('chord')) {
                    this.reset()
                }

                offset = this.offset()

                this.$el.css({
                    'top': this.model.get('offset').top + offset.top,
                    'left': this.model.get('offset').left + offset.left
                })

                this.parseNotes()
                this.parseTypes()

            },

            offset: function() {
                // Get the offset for the edit widget based on the chord it was
                // opened for.

                var beat_schema = this.model.get('chord')
                    .get('measure').get('beat_schema')

                var off_top
                var off_left

                switch(beat_schema) {

                    case '4':
                        off_top = 85
                        off_left = -10
                        break

                    case '2-2':
                        off_top = 60
                        off_left = -29
                        break

                    case '2-1-1':

                        switch(this.model.get('chord').get('order')) {

                            case 1:
                                off_top = 60
                                off_left = -29
                                break

                            case 2:
                                off_top = 47
                                off_left = -9
                                break

                            case 3:
                                off_top = 77
                                off_left = -39
                                break

                        }

                        break

                    case '1-1-2':

                        switch(this.model.get('chord').get('order')) {

                            case 1:
                                off_top = 77
                                off_left = -39
                                break

                            case 2:
                                off_top = 47
                                off_left = -9
                                break

                            case 3:
                                off_top = 60
                                off_left = -29
                                break

                        }

                        break

                    case '1-1-1-1':

                        switch(this.model.get('chord').get('order')) {

                            case 1:
                                off_top = 77
                                off_left = -39
                                break

                            case 2:
                                off_top = 47
                                off_left = -9
                                break

                            case 3:
                                off_top = 47
                                off_left = -9
                                break

                            case 4:
                                off_top = 77
                                off_left = -39
                                break

                        }

                        break

                }

                return {
                    top: off_top,
                    left: off_left
                }

            },

            parseNotes: function() {
                // Parses the note and the alt bass note choices

                var that = this
                var note_types = ['note', 'alt_bass_note']

                // If the notes are different from the last time, regenerate
                // the models/views.
                if(this.model.get('note_choices') !=
                   this.model.previousAttributes().note_choices) {

                    that.editWidgetNotes = []

                    _.each(note_types, function(note_type) {

                        that.editWidgetNotes[note_type] = new ChordEditNotes()
                        var editWidgetNote
                        var note_choices = that.$el.find('.chord-settings ' +
                            '.setting[data-key=' + note_type + '] ul')
                        note_choices.html('')

                        _.each(that.model.get('note_choices'), function(note) {

                            editWidgetNote = new ChordEditNote({
                                note_id: note.id, // used for `findWhere` later on
                                note: note,
                                note_type: note_type,
                                editWidget: that.model
                            })

                            that.editWidgetNotes[note_type].add(editWidgetNote)

                            note_choices.append(
                                new ChordEditNoteView({
                                    model: editWidgetNote
                                }).render().el
                            )

                        })

                    })

                }

                // Select the correct note
                _.each(note_types, function(note_type) {

                    // Deselect last selected if it exists
                    var current_selected = that.editWidgetNotes[note_type]
                        .findWhere({ selected: true })

                    if(current_selected) {
                        current_selected.set('selected', false)
                    }

                    // Select note if it is set (bass note doesn't have to be
                    // set)

                    var none_button = that.$el.find('.chord-settings ' +
                        '.setting[data-key=' + note_type + '] .none')

                    if(that.model.get(note_type)) {

                        if(none_button) {
                            none_button.removeClass('selected')
                        }

                        that.editWidgetNotes[note_type].findWhere({
                            note_id: that.model.get(note_type).id
                        }).set('selected', true)

                    }
                    else if(none_button) {
                        none_button.addClass('selected')
                    }

                })

                this.$el.show()

            },

            parseTypes: function() {
                // Select the correct chord type

                var current_selected = this.editWidget_chordTypes.findWhere({
                    selected: true
                })

                if(current_selected) {
                    current_selected.set('selected', false)
                }

                this.editWidget_chordTypes.findWhere({
                    chord_type_id: this.model.get('chord_type').id
                }).set('selected', true)

            },

            reset: function() {
                // Reset the edit widget to the "start state"
                //
                // For example, the chosen chord is the chord the edit is on and
                // the selected tab is the note tab.

                var chord = this.model.get('chord')

                this.model.set({
                    note: chord.get('note'),
                    chord_type: chord.get('chord_type'),
                    alt_bass_note: chord.get('alt_bass_note'),
                    note_choices: chord.get('measure').get('line')
                        .get('section').get('key').notes
                })

                // Show the chord type part that has the curent selected chord
                // type.
                var current_chord_type = this.editWidget_chordTypes.findWhere({
                    chord_type_id: this.model.get('chord_type').id
                })

                if(this.editWidget_chordTypes.indexOf(current_chord_type) > 11) {
                    this.showChordTypePart(2)
                }
                else {
                    this.showChordTypePart(1)
                }

                this.openTab('note')

            }

        })

    }
)
