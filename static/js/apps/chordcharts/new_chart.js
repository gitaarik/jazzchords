define(['widgets/key_select'], function(KeySelectWidget) {

    var keySelectWidgetDelegate = function() {};

    keySelectWidgetDelegate.tonic_changed = function(tonic) {
        $('.key-tonic-input').attr('value', tonic);
    };

    keySelectWidgetDelegate.tonality_changed = function(tonality) {
        $('.key-tonality-input').attr('value', tonality);
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
