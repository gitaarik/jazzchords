$(function() {

    var BoxedChart = {}
    BoxedChart.Models = {}
    BoxedChart.Views = {}
    BoxedChart.Collections = {}



    // BoxPart

    BoxedChart.Models.BoxPart = Backbone.Model.extend({

        initialize: function(attributes) {
            this.listenTo(this, 'change', this.parse_next_box)
        },

        parse_next_box: function() {
            // Parses the next box based on this box
            //
            // If this and the next box are on the same line and both have
            // beat_schema '4' then:
            // - If the chords are the same NOW, then next box will display the
            //   repeat sign ( % ).
            // - If the chord before the change of this box and the next chord
            //   were the same, then change the chord of the next box to the
            //   chord of the current box.

            if(
                this.get('beats') == 4 &&
                this.get('box').has('next_box') &&
                this.get('box').get('next_box').get('beat_schema') == '4' &&
                this.get('box').get('line') == this.get('box').get('next_box').get('line')
            ) {

                var next_box_part = this.get('box').get('next_box')
                    .get('parts').first()

                if(
                    // Check if chords are the same NOW
                    _.isEqual(next_box_part.get('note'), this.attributes.note) &&
                    _.isEqual(next_box_part.get('chord_type'), this.attributes.chord_type) &&
                    _.isEqual(next_box_part.get('alt_bass_note'), this.attributes.alt_bass_note)
                ) {
                    // Trigger the `render()` by setting timestamp in
                    // milliseconds in `changed` attribute
                    this.get('box').get('next_box').get('parts').first()
                        .set('changed', new Date().getTime())
                }
                else {

                    var prev_attr = this.previousAttributes()

                    if(
                        // Check if the current box's chord before the change
                        // is the same as the next box's chord
                        _.isEqual(next_box_part.get('note'), prev_attr.note) &&
                        _.isEqual(next_box_part.get('chord_type'), prev_attr.chord_type) &&
                        _.isEqual(next_box_part.get('alt_bass_note'), prev_attr.alt_bass_note)
                    ) {
                        this.get('box').get('next_box').get('parts').first().set({
                            'note': this.get('note'),
                            'chord_type': this.get('chord_type'),
                            'alt_bass_note': this.get('alt_bass_note')
                        })
                    }

                }

            }

        },

        chordName: function() {
            // Returns the full chord name for this boxPart

            var bass_note
            if(this.get('alt_bass_note')) {
                bass_note = '/' + this.get('alt_bass_note').name
            }
            else {
                bass_note = ''
            }

            return this.get('note').name + this.get('chord_type').chord_output
                + bass_note

        }

    })

    BoxedChart.Collections.BoxPart = Backbone.Collection.extend({
        model: BoxedChart.Models.BoxPart
    })

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



    // Box

    BoxedChart.Models.Box = Backbone.Model.extend({
        initialize: function() {
            this.set('parts', new BoxedChart.Collections.BoxPart(
                this.get('parts')))
        }
    })

    BoxedChart.Collections.Box = Backbone.Collection.extend({
        model: BoxedChart.Models.Box
    })

    BoxedChart.Views.Box = Backbone.View.extend({
        className: 'box',
    })



    // Line

    BoxedChart.Models.Line = Backbone.Model.extend({
        initialize: function() {
            this.set('boxes', new BoxedChart.Collections.Box(
                this.get('boxes')))
        }
    })

    BoxedChart.Collections.Line = Backbone.Collection.extend({
        model: BoxedChart.Models.Line
    })

    BoxedChart.Views.Line = Backbone.View.extend({
        className: 'line'
    })



    // Section

    BoxedChart.Models.Section = Backbone.Model.extend({
        initialize: function() {
            this.set('lines', new BoxedChart.Collections.Line(
                this.get('lines')))
        }
    })

    BoxedChart.Collections.Section = Backbone.Collection.extend({
        model: BoxedChart.Models.Section
    })

    BoxedChart.Views.Section = Backbone.View.extend({
        className: 'section'
    })



    // BoxedChart

    BoxedChart.Views.BoxedChart = Backbone.View.extend({
        className: 'boxed-chart'
    })

    BoxedChart.Models.BoxedChart = Backbone.Model.extend({
        initialize: function() {
            this.set('sections', new BoxedChart.Collections.Section(
                this.get('sections')))
        }
    })



    // Edit widget

    BoxedChart.Models.editWidget = Backbone.Model.extend({

        chordName: function() {
            // Returns the chordName for this editWidget

            var bass_note
            if(this.get('alt_bass_note')) {
                bass_note = '/' + this.get('alt_bass_note').name
            }
            else {
                bass_note = ''
            }

            return this.get('note').name + this.get('chord_type').chord_output
                + bass_note

        },

    })

    BoxedChart.Views.editWidget = Backbone.View.extend({

        el: '.chord-chart .chord-edit',
        model: BoxedChart.Models.editWidget,

        initialize: function() {
            this.listenTo(this.model, 'change', this.render)
        },

        events: {
            'click .controls .apply': 'applyChanges',
            'click .controls .discard': 'discardChanges',
            'click .tabs li': 'switchTab',
            'click .chord-settings .setting.type .toggle': 'toggleTypesMore',
        },

        applyChanges: function() {
            // Applies the changes made in the edit widget to the boxPart

            this.model.get('boxPart').set({
                note: this.model.get('note')
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

            tab.parent().find('li').removeClass('active')
                .parent().find('li[data-key=' + tab.data('key') + ']')
                .addClass('active')

            this.$el.find('.chord-settings .setting').hide().parent().find(
                '.setting.' + tab.data('key')).show()

        },

        toggleTypesMore: function(obj) {

            var chord_type = this.$el.find('.chord-settings .setting.type')

            if(chord_type.find('.type-1').is(':visible')) {
                chord_type.find('.type-1').hide()
                chord_type.find('.type-2').show()
            }
            else {
                chord_type.find('.type-2').hide()
                chord_type.find('.type-1').show()
            }

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
            // last one, set the data for this boxPart on the model.

            if(this.model.previousAttributes().boxPart !=
               this.model.get('boxPart')) {

                var boxPart = this.model.get('boxPart')

                this.model.set({
                    note: boxPart.get('note'),
                    chord_type: boxPart.get('chord_type'),
                    alt_bass_note: boxPart.get('alt_bass_note'),
                    note_choices: boxPart.get('box').get('line')
                        .get('section').get('key').notes
                })

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

        }

    })



    // Edit widget - Note

    BoxedChart.Models.editWidgetNote = Backbone.Model.extend()

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



    // Create edit widget

    var editWidget = new BoxedChart.Models.editWidget()

    new BoxedChart.Views.editWidget({
        model: editWidget
    })



    // Bind data from server to models/collections

    var boxed_chart_model = new BoxedChart.Models.BoxedChart(
        boxed_chart_data)



    // Bind views and models to existing HTML

    var boxed_chart = new BoxedChart.Views.BoxedChart({
        el: '.chord-chart .boxed-chart'
    })

    var section_number = 0
    var last_box = null

    // Loop through HTML elements and create appropriate views/models for these
    // elements
    boxed_chart.$el.find('.section').each(function() {

        var line_number = 0
        var section_model = boxed_chart_model.get('sections').models[section_number]
        section_model.set('boxed_chart', boxed_chart.model)

        var section = new BoxedChart.Views.Section({
            el: this,
            model: section_model
        })
        boxed_chart.$el.append(section)

        section.$el.find('.chord-boxes .line').each(function() {

            var box_number = 0
            var line_model = section.model.get('lines').models[line_number]
            line_model.set('section', section.model)

            var line = new BoxedChart.Views.Line({
                el: this,
                model: line_model
            })
            section.$el.append(line)

            line.$el.find('.box').each(function() {

                var part_number = 0
                var box_model = line.model.get('boxes').models[box_number]
                box_model.set('line', line.model)

                var box = new BoxedChart.Views.Box({
                    el: this,
                    model: box_model
                })

                if(last_box) {
                    box.model.set('prev_box', last_box.model)
                    last_box.model.set('next_box', box.model)
                }

                last_box = box
                line.$el.append(box)

                box.$el.find('.part').each(function() {

                    var boxPart_model = box.model.get('parts').models[part_number]
                    boxPart_model.set('box', box.model)

                    var boxPart = new BoxedChart.Views.BoxPart({
                        el: this,
                        model: boxPart_model
                    })
                    part_number++

                })

                box_number++

            })

            line_number++

        })

        section_number++

    })



    // Other event listeners

    $('html').on('click', function(event) {

        // close the edit widget if there was a click outside the edit widget

        if(editWidget.get('visible')) {

            // check if the click wasn't a click to open the widget, or a click
            // inside the widget

            var target = $(event.target)

            if(!(
                (
                    // check if click was to open the widget
                    target.hasClass('chord-name') &&
                    target.closest('.boxed-chart').length
                ) || (
                    // check if click was in the widget
                    target.closest('.chord-edit').length &&
                    target.closest('.chord-chart').length
                )
            )) {
                // close the widget
                editWidget.set('visible', false)
            }

        }

    })

})
