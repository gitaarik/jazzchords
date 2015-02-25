var chart = require('./_chart.js');
var LyricsUrlView = require('../views/_lyrics-url.js');


new LyricsUrlView({
    el: GLOBALS.base_el_selector + ' .chord-chart-header .lyrics-url',
    model: chart
});
