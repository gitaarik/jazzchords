require(
    [
        'collections/edit_widget_chord_types',
        'models/chart',
        'models/edit_widget',
        'views/chart',
        'views/section',
        'views/line',
        'views/box',
        'views/box_part',
        'views/edit_widget'
    ],
    function(
        EditWidgetChordTypes,
        Chart,
        EditWidget,
        ChartView,
        SectionView,
        LineView,
        BoxView,
        BoxPartView,
        EditWidgetView
    ) {

        // Create edit widget

        var editWidget = new EditWidget()

        new EditWidgetView({
            model: editWidget
        })


        // Bind data from server to models/collections

        var chart = new Chart(boxed_chart_data)


        // Bind views and models to existing HTML

        var chartView = new ChartView({
            el: '.chord-chart .boxed-chart'
        })

        var section_number = 0
        var last_box = null

        // Loop through HTML elements and create appropriate views/models for these
        // elements
        chartView.$el.find('.section').each(function() {

            var line_number = 0
            var section = chart.get('sections').models[section_number]
            section.set('boxed_chart', chart)

            var sectionView = new SectionView({
                el: this,
                model: section
            })
            chartView.$el.append(sectionView)

            sectionView.$el.find('.chord-boxes .line').each(function() {

                var box_number = 0
                var line = section.get('lines').models[line_number]
                line.set('section', section)

                var lineView = new LineView({
                    el: this,
                    model: line
                })
                sectionView.$el.append(lineView)

                lineView.$el.find('.box').each(function() {

                    var part_number = 0
                    var box = line.get('boxes').models[box_number]
                    box.set('line', line)

                    var boxView = new BoxView({
                        el: this,
                        model: box
                    })

                    if(last_box) {
                        box.set('prev_box', last_box)
                        last_box.set('next_box', box)
                    }

                    last_box = box
                    lineView.$el.append(boxView)

                    boxView.$el.find('.part').each(function() {

                        var boxPart = box.get('parts').models[part_number]
                        boxPart.set({
                            box: box,
                            editWidget: editWidget
                        })

                        new BoxPartView({
                            el: this,
                            model: boxPart
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

    }
)
