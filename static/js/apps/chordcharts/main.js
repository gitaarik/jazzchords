require(
    [
        'models/chart',
        'views/chart',
        'views/section',
        'views/line',
        'views/measure',
        'views/chord',
        'init/key_change_widget'
    ],
    function(
        Chart,
        ChartView,
        SectionView,
        LineView,
        MeasureView,
        ChordView,
        keyChangeWidget
    ) {

        // Bind data from server to models/collections

        var chart = new Chart(GLOBALS.chart_data);


        // Bind views and models to existing HTML

        var chartView = new ChartView({
            el: '.chord-chart .chart',
            model: chart
        });

        var section_number = 0;

        // Loop through HTML elements and create appropriate views/models for these
        // elements
        chartView.$el.find('.section').each(function() {

            var line_number = 0;
            var section = chart.get('sections').models[section_number];
            var sectionView = new SectionView({
                el: this,
                model: section
            });
            chartView.$el.append(sectionView);

            sectionView.$el.find('.lines .line').each(function() {

                var measure_number = 0;
                var line = section.get('lines').models[line_number];
                var lineView = new LineView({
                    el: this,
                    model: line
                });
                sectionView.$el.append(lineView);

                lineView.$el.find('.measure').each(function() {

                    var chord_number = 0;
                    var measure = line.get('measures').models[measure_number];
                    var measureView = new MeasureView({
                        el: this,
                        model: measure
                    });

                    lineView.$el.append(measureView);
                    measureView.drawSeperationLines();
                    var chord_views = [];

                    measureView.$el.find('.chord').each(function() {

                        var chord = measure.get('chords').models[chord_number];

                        chord_views.push(
                            new ChordView({
                                el: this,
                                model: chord
                            })
                        );
                        chord_number++;

                    });

                    measure.set({ chord_views: chord_views }, { silent: true });
                    measure_number++;

                });

                line_number++;

            });

            sectionView.renderSidebar();
            section_number++;

        });

        GLOBALS.parsed = true;

    }
);
