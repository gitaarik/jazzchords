require(
    [
        'collections/chord_edit_chord_types',
        'models/chart',
        'views/chart',
        'views/section',
        'views/line',
        'views/measure',
        'views/chord',
        'init/chord_edit',
        'init/key_change_widget'
    ],
    function(
        ChordEditChordTypes,
        Chart,
        ChartView,
        SectionView,
        LineView,
        MeasureView,
        ChordView,
        editWidget,
        keyChangeWidget
    ) {

        // Bind data from server to models/collections

        var chart = new Chart(GLOBALS.chart_data)


        // Bind views and models to existing HTML

        var chartView = new ChartView({
            el: '.chord-chart .chart'
        })

        var section_number = 0
        var last_measure = null

        // Loop through HTML elements and create appropriate views/models for these
        // elements
        chartView.$el.find('.section').each(function() {

            var line_number = 0
            var section = chart.get('sections').models[section_number]
            section.set('chart', chart)

            var sectionView = new SectionView({
                el: this,
                model: section
            })
            chartView.$el.append(sectionView)
            sectionView.drawIndicatorLines()

            sectionView.$el.find('.lines .line').each(function() {

                var measure_number = 0
                var line = section.get('lines').models[line_number]
                line.set('section', section)

                var lineView = new LineView({
                    el: this,
                    model: line
                })
                sectionView.$el.append(lineView)

                lineView.$el.find('.measure').each(function() {

                    var chord_number = 0
                    var measure = line.get('measures').models[measure_number]
                    measure.set('line', line)

                    var measureView = new MeasureView({
                        el: this,
                        model: measure
                    })

                    if(last_measure) {
                        measure.set('prev_measure', last_measure)
                        last_measure.set('next_measure', measure)
                    }

                    last_measure = measure
                    lineView.$el.append(measureView)
                    measureView.drawSeperationLines()

                    measureView.$el.find('.chord').each(function() {

                        var chord = measure.get('chords').models[chord_number]
                        chord.set({
                            measure: measure,
                            editWidget: editWidget
                        })

                        new ChordView({
                            el: this,
                            model: chord
                        })
                        chord_number++

                    })

                    measure_number++

                })

                line_number++

            })

            section_number++

        })

    }
)
