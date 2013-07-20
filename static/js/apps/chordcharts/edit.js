$(function() {

    var BoxedChart = {}
    BoxedChart.Models = {}
    BoxedChart.Views = {}
    BoxedChart.Templates = {}
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

            event.stopPropagation()

            chord_name = this.$el.find('.chord-name')

            editWidgetModel.set({
                visible: true,
                chord_name: this.model.get('chart_output'),
                offset_top: $(event.target).offset().top - 11,
                offset_left: $(event.target).offset().left - 11,
                font_size: chord_name.css('font-size'),
                letter_spacing: chord_name.css('letter-spacing')
            })

            this.$el.closest('.section').trigger('edit-widget-open')

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
        className: 'section',
        initialize: function(data) {

            notes = this.model.get('key').notes
            note_names = []

            for(i in notes) {
                note_names.push(notes[i].name)
            }

            this.model.set('note_list',
                '<li>' + note_names.join('</li><li>') + '</li>')

        },
        events: {
            'edit-widget-open': function() {

                $('.chord-chart .chord-edit .tone-choices').html(
                    this.model.get('note_list')
                )

            }
        }
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

    BoxedChart.Templates.editWidget = _.template(
        $('#js-templates .chord-edit').html())

    BoxedChart.Views.editWidget = Backbone.View.extend({
        el: '.chord-chart .chord-edit',
        template: BoxedChart.Templates.editWidget,
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },
        events: {
            'click': function(event) {
                event.stopPropagation()
            }
        },
        render: function() {

            if(this.model.get('visible')) {

                this.$el.html(this.template({
                    chord_name: this.model.get('chord_name')
                }))
                .css({
                    'top': this.model.get('offset_top'),
                    'left': this.model.get('offset_left')
                })
                .show()
                .find('.chord-name').css({
                    'font-size': this.model.get('font_size'),
                    'letter-spacing': this.model.get('letter_spacing')
                })

            }
            else {
                this.$el.hide()
            }

        }
    })

    var editWidgetModel = new BoxedChart.Models.editWidget()

    new BoxedChart.Views.editWidget({
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
        boxed_chart.$el.append(section)

        section.$el.find('.chord-boxes .line').each(function() {

            var box_number = 0
            var line = new BoxedChart.Views.Line({
                el: this,
                model: section.model.get('lines').models[line_number]
            })
            section.$el.append(line)

            line.$el.find('.box').each(function() {

                var part_number = 0
                var box = new BoxedChart.Views.Box({
                    el: this,
                    model: line.model.get('boxes').models[box_number]
                })
                line.$el.append(box)

                box.$el.find('.part').each(function() {

                    var boxPart = new BoxedChart.Views.BoxPart({
                        el: this,
                        model: box.model.get('parts').models[part_number]
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

    $('html').on('click', function() {
        editWidgetModel.set('visible', false)
    })

})
