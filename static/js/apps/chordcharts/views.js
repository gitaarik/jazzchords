BoxedChart.Views = {}

BoxedChart.Views.BoxPart = Backbone.View.extend({

    model: BoxedChart.Models.BoxPart,

    initialize: function() {
        this.listenTo(this.model, 'change', this.render)
    },

    events: {
        'click .chord-name': 'openEditWidget'
    },

    openEditWidget: function() {
        // Opens the edit widget for this boxPart

        var chord_name = this.$el.find('.chord-name')

        editWidget.set({
            visible: true,
            boxPart: this.model,
            chord_name_offset: chord_name.offset(),
            font_size: chord_name.css('font-size'),
            letter_spacing: chord_name.css('letter-spacing')
        })

    },

    chartOutput: function() {
        // Returns the string that should be outputted on the chart. This
        // is usually the chordName but in some cases the repeat sign ( % )

        // If this box and the previous box's box_schema are both '4' and
        // are on the same line and had the same chord, use the repeat sign
        // ( % ). Otherwise use the chordName.
        if(
            this.model.get('beats') == 4 &&
            this.model.get('box').has('prev_box') &&
            this.model.get('box').get('line') == this.model.get('box')
                .get('prev_box').get('line') &&
            this.model.get('box').get('prev_box')
                .get('beat_schema') == '4' &&
            this.model.get('box').get('prev_box').get('parts')
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

BoxedChart.Views.Box = Backbone.View.extend({
    className: 'box',
})

BoxedChart.Views.Line = Backbone.View.extend({
    className: 'line'
})

BoxedChart.Views.Section = Backbone.View.extend({
    className: 'section'
})

BoxedChart.Views.BoxedChart = Backbone.View.extend({
    className: 'boxed-chart'
})

BoxedChart.Views.editWidget = Backbone.View.extend({

    el: '.chord-chart .chord-edit',
    model: BoxedChart.Models.editWidget,

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
        var chordType_number = 0
        var chord_types = []

        this.chord_type.find('li').each(function() {

            var chord_type_model = editWidget_chordTypes.models[chordType_number]
            chord_type_model.set('editWidget', that.model)

            new BoxedChart.Views.editWidgetChordType({
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
                    new BoxedChart.Views.editWidgetNote({
                        model: new BoxedChart.Models.editWidgetNote({
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

BoxedChart.Views.editWidgetNote = Backbone.View.extend({
    tagName: 'li',
    model: BoxedChart.Models.editWidgetNote,
    events: {
        'click': 'chooseNote'
    },
    chooseNote: function() {
        // Sets the chosen note on the editWidget
        this.model.get('editWidget').model.set('note',
            this.model.get('note'))
    },
    render: function() {
        this.$el.html(this.model.get('note').name)
        return this
    }
})

BoxedChart.Views.editWidgetChordType = Backbone.View.extend({

    model: BoxedChart.Models.editWidgetChordType,

    events: {
        'click': 'chooseSymbol'
    },

    chooseSymbol: function() {
        this.model.get('editWidget').set('chord_type',
            this.model)
    },

    render: function() {
        this.$el.html(this.model.get('symbol'))
    }

})
