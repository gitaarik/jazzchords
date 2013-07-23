$(function() {

    var BoxedChart = {}
    BoxedChart.Models = {}
    BoxedChart.Views = {}
    BoxedChart.Collections = {}



    // BoxPart

    BoxedChart.Models.BoxPart = Backbone.Model.extend()

    BoxedChart.Collections.BoxPart = Backbone.Collection.extend({
        model: BoxedChart.Models.BoxPart
    })

    BoxedChart.Views.BoxPart = Backbone.View.extend({
        events: {
            'click .chord-name': 'openEditWidget'
        },
        openEditWidget: function(event) {

            chord_name = this.$el.find('.chord-name')

            editWidget.open({
                visible: true,
                box: this.$el,
                note: this.model.get('note'),
                note_choices: this.model.get('box').model.get('line').model
                    .get('section').model.get('key').notes,
                chord_type: this.model.get('chord_type'),
                offset_top: $(event.target).offset().top - 11,
                offset_left: $(event.target).offset().left - 11,
                font_size: chord_name.css('font-size'),
                letter_spacing: chord_name.css('letter-spacing')
            })

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

    BoxedChart.Models.editWidget = Backbone.Model.extend()

    BoxedChart.Views.editWidget = Backbone.View.extend({

        el: '.chord-chart .chord-edit',
        model: BoxedChart.Models.editWidget,

        chordName: function() {
            return this.model.get('note').name + this.model.get('chord_type').symbol
        },

        open: function(data) {
            this.model.set(data)
            this.render()
        },

        setNote: function(note) {
            this.model.set('note', note)
            this.$el.find('.chord-name').html(this.chordName())
        },

        render: function() {

            if(this.model.get('visible')) {

                this.$el.css({
                    'top': this.model.get('offset_top'),
                    'left': this.model.get('offset_left')
                })
                .show()
                .find('.chord-name').html(this.chordName()).css({
                    'font-size': this.model.get('font_size'),
                    'letter-spacing': this.model.get('letter_spacing')
                })

                var tone_choices = this.$el.find('.tone-choices')
                tone_choices.html('')

                _.each(this.model.get('note_choices'), function(note) {

                    tone_choices.append(
                        new BoxedChart.Views.editWidgetNote({
                            model: new BoxedChart.Models.editWidgetNote({
                                note: note,
                                editWidget: this
                            })
                        }).render().el
                    )

                }, this)

            }
            else {
                this.$el.hide()
            }

            return this

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
            this.model.get('editWidget').setNote(this.model.get('note'))
        },
        render: function() {
            this.$el.html(this.model.get('note').name)
            return this
        }
    })



    // Create edit widget

    var editWidgetModel = new BoxedChart.Models.editWidget()

    var editWidget = new BoxedChart.Views.editWidget({
        model: editWidgetModel
    })



    // Bind data from server to models/collections

    var boxed_chart_model = new BoxedChart.Models.BoxedChart(
        boxed_chart_data)



    // Bind views and models to existing HTML

    var boxed_chart = new BoxedChart.Views.BoxedChart({
        el: '.chord-chart .boxed-chart'
    })

    var section_number = 0

    boxed_chart.$el.find('.section').each(function() {

        var line_number = 0
        var section = new BoxedChart.Views.Section({
            el: this,
            model: boxed_chart_model.get('sections').models[section_number]
        })
        section.model.set('boxed_chart', boxed_chart)
        boxed_chart.$el.append(section)

        section.$el.find('.chord-boxes .line').each(function() {

            var box_number = 0
            var line = new BoxedChart.Views.Line({
                el: this,
                model: section.model.get('lines').models[line_number]
            })
            line.model.set('section', section)
            section.$el.append(line)

            line.$el.find('.box').each(function() {

                var part_number = 0
                var box = new BoxedChart.Views.Box({
                    el: this,
                    model: line.model.get('boxes').models[box_number]
                })
                box.model.set('line', line)
                line.$el.append(box)

                box.$el.find('.part').each(function() {

                    var boxPart = new BoxedChart.Views.BoxPart({
                        el: this,
                        model: box.model.get('parts').models[part_number]
                    })
                    boxPart.model.set('box', box)
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

        if(editWidgetModel.get('visible')) {

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
                editWidgetModel.set('visible', false)
            }

        }
    })

})
