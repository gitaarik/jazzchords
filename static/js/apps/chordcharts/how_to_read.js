var MeasureWidget = require('./widgets/measure.js');

$('.how-to-read .measures .measures .measure').each(function() {

    var measure = $(this);

    new MeasureWidget(measure, measure.data('beatschema'), 100, 100, 1)
        .measure_draw_separation_lines();

});
