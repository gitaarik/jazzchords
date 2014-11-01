var MeasureWidget = require('../core/widgets/_measure.js');

$('.how-to-read .measures .measures .measure').each(function() {

    var measure = $(this);

    new MeasureWidget(
        measure,
        measure.data('beatschema'),
        GLOBALS.settings.box_width,
        GLOBALS.settings.box_height,
        GLOBALS.settings.border_width
    ).measure_draw_separation_lines();

});
