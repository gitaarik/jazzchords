var chart = require('./_chart.js');
var ShortDescriptionView = require('../views/_short-description.js');


new ShortDescriptionView({
    el: GLOBALS.base_el_selector + ' .chord-chart-header .short-description',
    model: chart
});
