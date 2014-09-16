var KeySelectWidget = require('../core/widgets/key_select.js');

var keySelectWidgetDelegate = function() {};

keySelectWidgetDelegate.key_changed = function(key) {
    $('.key-tonic-input').prop('value', key.get('tonic'));
    $('.key-tonality-input').prop('value', key.get('tonality'));
};


new KeySelectWidget($('.key-select-widget'), keySelectWidgetDelegate);

this.chart_settings = $('.chart-settings');

this.chart_settings.find('.tooltip-button').mouseover(function() {
    $(this).closest('tr').find('.tooltip-popup').show();
    $(this).closest('tr').addClass('tooltip-highlighted');
});

this.chart_settings.find('.tooltip-button').mouseout(function() {
    $(this).closest('tr').find('.tooltip-popup').hide();
    $(this).closest('tr').removeClass('tooltip-highlighted');
});
