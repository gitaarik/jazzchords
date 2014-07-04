define(['widgets/key_select'], function(KeySelectWidget) {

    var keySelectWidgetDelegate = function() {};

    keySelectWidgetDelegate.key_changed = function(key) {
        $('.key-tonic-input').attr('value', key.get('tonic'));
        $('.key-tonality-input').attr('value', key.get('tonality'));
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

});
