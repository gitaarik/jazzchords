define(['widgets/key_select'], function(KeySelectWidget) {

    new KeySelectWidget();

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
