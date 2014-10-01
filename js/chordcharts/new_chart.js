require('../core/widgets/formtable_tooltips.js');
var KeySelectWidget = require('../core/widgets/key_select.js');

var keySelectWidgetDelegate = function() {};

keySelectWidgetDelegate.key_changed = function(key) {
    $('.key-tonic-input').prop('value', key.get('tonic'));
    $('.key-tonality-input').prop('value', key.get('tonality'));
};

new KeySelectWidget($('.key-select-widget'), keySelectWidgetDelegate);

$(function() {
    $('#song').focusAtEnd();
});
