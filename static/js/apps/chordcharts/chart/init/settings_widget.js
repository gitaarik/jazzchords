define(
    [],
    function() {

        var settings_el = $('.chord-chart .chart-edit-buttons .settings');
        var widget_el = settings_el.find('.widget');

        settings_el.find('.label').click(function() {
            widget_el.toggle();
        });

        widget_el.find('li.delete').click(function() {

            if (confirm("Are you sure you want to delete the chart")) {

                console.log('ja');

            }

        });

        $('html').click(function(event) {

            if (widget_el.is(':visible')) {

                if(
                    !$(event.target)
                        .closest('.settings')
                        .closest('.chart-edit-buttons')
                        .closest('.chord-chart')
                        .length
                ) {
                    widget_el.hide();
                }

            }

        });

    }
);
