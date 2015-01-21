var ChartInfoEdit = require('../models/_chart-info-edit.js');
var ChartInfoEditView = require('../views/_chart-info-edit.js');
var chart = require('./_chart.js');


var chartInfoEdit = new ChartInfoEdit({ chart: chart });

new ChartInfoEditView({
    el: GLOBALS.base_el_selector + ' .chart-info-edit',
    model: chartInfoEdit
});
