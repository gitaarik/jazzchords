define(
    ['models/key_change_widget', 'views/key_change_widget'],
    function(KeyChangeWidget, KeyChangeWidgetView) {

        var keyChangeWidget = new KeyChangeWidget()

        new KeyChangeWidgetView({
            el: $('.chord-chart .key-select'),
            model: keyChangeWidget
        })

        $('html').on('click', function(event) {

            if(keyChangeWidget.get('visible')) {

                var target = $(event.target)

                if(
                    !(
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was inside the widget
                        target.closest('.key-select').length
                    ) || (
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was on the title of the widget
                        // while the widget was open
                        target.closest('.current-key').closest('.open').length
                    )
                ) {
                    keyChangeWidget.set('visible', false)
                }

            }

        })

        return keyChangeWidget

    }
)
