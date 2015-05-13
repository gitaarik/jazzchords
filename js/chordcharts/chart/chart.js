var ChartView = require('./views/_chart.js');
var SectionView = require('./views/_section.js');
var LineView = require('./views/_line.js');
var MeasureView = require('./views/_measure.js');
var ChordView = require('./views/_chord.js');
var chart = require('./init/_chart.js');

require('./init/_song-name.js');
require('./init/_short-description.js');
require('./init/_video-url.js');
require('./init/_lyrics-url.js');
require('./init/_public-switch.js');
require('./init/_transpose-widget.js');
require('./init/_settings-widget.js');


// Bind views and models to existing HTML

var chartView = new ChartView({
    el: GLOBALS.base_el_selector + ' .chart',
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
