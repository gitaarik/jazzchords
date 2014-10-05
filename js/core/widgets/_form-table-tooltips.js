(function() {

    var form_table = $('._form-table');

    form_table.find('.tooltip-button').mouseover(function() {
        $(this).closest('tr').find('.tooltip-popup').show();
        $(this).closest('tr').addClass('tooltip-highlighted');
    });

    form_table.find('.tooltip-button').mouseout(function() {
        $(this).closest('tr').find('.tooltip-popup').hide();
        $(this).closest('tr').removeClass('tooltip-highlighted');
    });

})();
