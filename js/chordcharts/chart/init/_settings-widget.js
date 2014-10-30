$(
    GLOBALS.base_el_selector +
    ' .chart-menu .settings .widget .sub-buttons .sub-button.delete'
).click(function() {

    if (confirm("Are you really sure you want to delete the chart?")) {
        $(this).find('form').submit();
    }

});

