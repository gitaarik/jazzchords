define(
    ['models/measure_edit', 'views/measure_edit'],
    function(MeasureEdit, MeasureEditView) {

        var measureEdit = new MeasureEdit()

        new MeasureEditView({
            el: '.chord-chart .measure-edit',
            model: measureEdit
        })

        $('html').on('click', function(event) {

            // close the widget if there was a click outside the widget

            if(measureEdit.get('visible')) {

                var target = $(event.target)

                // check if the click wasn't a click to open the widget, or a click
                // inside the widget

                if(
                    // click wasn't inside the chord chart
                    !target.closest('.chord-chart').length ||
                    (
                        // click was inside the chord chart
                        target.closest('.chord-chart').length &&
                        // click wasn't in the widget
                        !target.closest('.measure-edit').length &&
                        (
                            (
                                // click was in the measure
                                target.closest('.measure').length &&
                                // click was in the chord-name
                                target.closest('.chord-name').length
                            ) || (
                                // click wasn't in the measure
                                !target.closest('.measure').length
                            )
                        )
                    )
                ) {
                    // close the widget
                    measureEdit.discard()
                }

            }

        })

        return measureEdit

    }
)
