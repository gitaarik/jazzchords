var ChartInfo = require('../models/_chart-info.js');
var ChartInfoView = require('../views/_chart-info.js');
var chart = require('./_chart.js');


var chartInfo = new ChartInfo({ chart: chart });

new ChartInfoView({
    el: GLOBALS.base_el_selector + ' .chart-info',
    model: chartInfo
});
