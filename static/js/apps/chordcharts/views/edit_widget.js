define(
    [
        'collections/edit_widget_notes',
        'collections/edit_widget_chord_types',
        'models/edit_widget',
        'models/edit_widget_note',
        'views/edit_widget_note',
        'views/edit_widget_chord_type'
    ],
    function(
        EditWidgetNotes,
        EditWidgetChordTypes,
        EditWidget,
        EditWidgetNote,
        EditWidgetNoteView,
        EditWidgetChordTypeView
    ) {

        return Backbone.View.extend({

            el: '.chord-chart .chord-edit',
            model: EditWidget,

            events: {
                'click .controls .apply': 'applyChanges',
                'click .controls .discard': 'discardChanges',
                'click .tabs li': 'switchTab',
                'click .chord-settings .setting.type .toggle': 'toggleChordTypes',
            },

            initialize: function() {
                this.chord_type = this.$el.find('.chord-settings .setting.type')
                this.initChordTypes()
                this.listenTo(this.model, 'change', this.render)
            },

            initChordTypes: function() {
                // Creates the views for the chord type choices and binds them to
                // the existing HTML

                var that = this
                this.editWidget_chordTypes = new EditWidgetChordTypes()

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

                    new EditWidgetChordTypeView({
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

                this.model.set('visible', false)

            },

            discardChanges: function() {
                // Closes the edit widget without applying the changes to the
                // chord
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
                    '.setting.' + key).show()

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

            showChordTypePart: function(number) {
                // Shows the chord type part of the provided number
                // The chord type choices are in these parts
                this.chord_type.find('.type-part').hide()
                this.chord_type.find('.type-part-' + number).show()
            },

            render: function() {

                // Only show the edit widget when 'visible' is true,
                // otherwise, hide the edit widget.

                if(this.model.get('visible')) {
                    this.show()
                }
                else {
                    this.$el.hide()
                }

                return this

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

                this.$el.css({
                    'top': this.model.get('chord_name_offset').top - 11,
                    'left': this.model.get('chord_name_offset').left - 11
                })
                .find('.chord-name').html(this.model.chordName()).css({
                    'font-size': this.model.get('font_size'),
                    'letter-spacing': this.model.get('letter_spacing')
                })

                this.parseNotes()
                this.parseTypes()

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

                        that.editWidgetNotes[note_type] = new EditWidgetNotes()
                        var editWidgetNote
                        var note_choices = that.$el.find(
                            '.chord-settings .' + note_type)
                        note_choices.html('')

                        _.each(that.model.get('note_choices'), function(note) {

                            editWidgetNote = new EditWidgetNote({
                                note_id: note.id, // used for `findWhere` later on
                                note: note,
                                note_type: note_type,
                                editWidget: that.model
                            })

                            that.editWidgetNotes[note_type].add(editWidgetNote)

                            note_choices.append(
                                new EditWidgetNoteView({
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
                    if(that.model.get(note_type)) {

                        that.editWidgetNotes[note_type].findWhere({
                            note_id: that.model.get(note_type).id
                        }).set('selected', true)

                    }

                })

                this.$el.show()

            },

            parseTypes: function() {

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
