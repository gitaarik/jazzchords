define(
    ['models/key_change_widget', 'views/key_change_widget'],
    function(KeyChangeWidget, KeyChangeWidgetView) {

        var keyChangeWidget = new KeyChangeWidget();

        new KeyChangeWidgetView({
            el: $('.chord-chart .key-select'),
            model: keyChangeWidget
        });

        $('html').on('click', function(event) {

            // Close the widget if there was a click outside it.

            if (keyChangeWidget.get('visible')) {

                var target = $(event.target);

                // Check if the click wasn't a click to open the widget,
                // or a click inside the widget.
                if (
                    !target
                        .closest('.key-select')
                        .closest('.chord-chart')
                        .length &&
                    !target
                        .closest('.current-key')
                        .closest('.open')
                        .closest('.chord-chart')
                        .length
                ) {
                    keyChangeWidget.set('visible', false);
                }

            }

        });

        return keyChangeWidget;

    }
);
