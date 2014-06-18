define(
    ['models/measure_edit', 'views/measure_edit'],
    function(MeasureEdit, MeasureEditView) {

        var measureEdit = new MeasureEdit();

        new MeasureEditView({
            el: '.chord-chart .measure-edit',
            model: measureEdit
        });

        $('html').on('click', function(event) {

            // Close the widget if there was a click outside it.

            if (measureEdit.get('visible')) {

                var target = $(event.target);

                // Check if the click wasn't a click to open the widget,
                // or a click inside the widget.
                if (
                    !target
                        .closest('.measure-edit')
                        .closest('.chord-chart')
                        .length &&
                    !target
                        .closest('.measure')
                        .closest('.chord-chart')
                        .length
                ) {
                    // close the widget
                    measureEdit.set('visible', false);
                }

            }

        });

        return measureEdit;

    }
);
