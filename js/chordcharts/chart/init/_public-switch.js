var chart = require('./_chart.js');


var publicSwitchEl = $(GLOBALS.base_el_selector + ' .public-switch');

publicSwitchEl.click(function() {

    var publicState;

    if(publicSwitchEl.hasClass('switch-state-on')) {
        publicState = false;
    } else {
        publicState = true;
    }

    if (publicState) {
        publicSwitchEl.addClass('switch-state-on');
        publicSwitchEl.removeClass('switch-state-off');
    } else {
        publicSwitchEl.removeClass('switch-state-on');
        publicSwitchEl.addClass('switch-state-off');
    }

    chart.set('public', publicState);
    chart.save();

});
