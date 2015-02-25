var chart = require('./_chart.js');
var VideoUrlView = require('../views/_video-url.js');


new VideoUrlView({
    el: GLOBALS.base_el_selector + ' .chord-chart-header .video-url',
    model: chart
});
