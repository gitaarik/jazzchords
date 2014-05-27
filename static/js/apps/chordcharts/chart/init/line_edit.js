define(
    [
        'models/line_edit',
        'views/line_edit'
    ],
    function(
        LineEdit,
        LineEditView
    ) {

        var lineEdit = new LineEdit();

        new LineEditView({
            el: '.chord-chart .line-edit',
            model: lineEdit
        });

        $('html').on('click', function(event) {

            // If the editwidget is visible, hide it if there was a
            // click outside it.

            if (lineEdit.get('visible')) {

                var target = $(event.target);

                // Check if the click wasn't a click to open the widget,
                // or a click inside the widget.

                if (!(
                    (
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was to open the widget
                        target.closest('.section-sidebar-part').length
                    ) || (
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was in the widget
                        target.closest('.line-edit').length
                    )
                )) {
                    // close the widget
                    lineEdit.set('visible', false);
                }

            }

        });

        return lineEdit;

    }
);
