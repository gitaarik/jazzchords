define(
    ['models/chord_edit', 'views/chord_edit'],
    function(ChordEdit, ChordEditView) {

        // Create edit widget

        var editWidget = new ChordEdit()

        new ChordEditView({
            model: editWidget
        })

        $('html').on('click', function(event) {

            // close the edit widget if there was a click outside the edit widget

            if(editWidget.get('visible')) {

                var target = $(event.target)

                // check if the click wasn't a click to open the widget, or a click
                // inside the widget

                if(!(
                    (
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was to open the widget
                        target.hasClass('chord-name')
                    ) || (
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was in the widget
                        target.closest('.chord-edit').length
                    )
                )) {
                    // close the widget
                    editWidget.set('visible', false)
                }

            }

        })

        return editWidget

    }
)
