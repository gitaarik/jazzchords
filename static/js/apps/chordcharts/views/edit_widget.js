define(
    [
        'collections/edit_widget_chord_types',
        'models/edit_widget',
        'models/edit_widget_note',
        'views/edit_widget_note',
        'views/edit_widget_chord_type'
    ],
    function(
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
                var editWidget_chordTypes = new EditWidgetChordTypes(GLOBALS.chord_types_data)
                var chordType_number = 0
                var chord_types = []

                this.chord_type.find('li').each(function() {

                    var chord_type_model = editWidget_chordTypes.models[chordType_number]
                    chord_type_model.set('editWidget', that.model)

                    new EditWidgetChordTypeView({
                        el: this,
                        model: chord_type_model
                    })

                    chordType_number++

                })

            },

            applyChanges: function() {
                // Applies the changes made in the edit widget to the boxPart

                this.model.get('boxPart').set({
                    note: this.model.get('note'),
                    chord_type: this.model.get('chord_type')
                })

                this.model.set('visible', false)

            },

            discardChanges: function() {
                // Closes the edit widget without applying the changes to the
                // boxPart
                this.model.set('visible', false)
            },

            switchTab: function(obj) {
                // Switches to a tab in the edit widget
                // like 'note', 'type' and 'bass'

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

                // If the edit widget opens on a different boxPart than the
                // last one, then reset the editWidget.

                if(this.model.previousAttributes().boxPart !=
                   this.model.get('boxPart')) {
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

                if(this.model.get('note_choices') !=
                   this.model.previousAttributes().note_choices) {

                    var note_choices = this.$el.find('.chord-settings .note')
                    note_choices.html('')

                    _.each(this.model.get('note_choices'), function(note) {

                        note_choices.append(
                            new EditWidgetNoteView({
                                model: new EditWidgetNote({
                                    note: note,
                                    editWidget: this
                                })
                            }).render().el
                        )

                    }, this)

                }

                this.$el.show()

            },

            reset: function() {
                // Reset the edit widget to the "start state"
                //
                // For example, the chosen chord is the chord the edit is on and
                // the selected tab is the note tab.

                var boxPart = this.model.get('boxPart')

                this.model.set({
                    note: boxPart.get('note'),
                    chord_type: boxPart.get('chord_type'),
                    alt_bass_note: boxPart.get('alt_bass_note'),
                    note_choices: boxPart.get('box').get('line')
                        .get('section').get('key').notes
                })

                this.showChordTypePart(1)
                this.openTab('note')

            }

        })

    }
)
