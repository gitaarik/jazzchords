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

            // Close the widget if there was a click outside it.

            if (lineEdit.get('visible')) {

                var target = $(event.target);

                // Check if the click wasn't a click to open the widget,
                // or a click inside the widget.
                if (
                    !target
                        .closest('.section-sidebar-part')
                        .closest('.chord-chart')
                        .length &&
                    !target
                        .closest('.line-edit')
                        .closest('.chord-chart')
                        .length
                ) {
                    // close the widget
                    lineEdit.set('visible', false);
                }

            }

        });

        return lineEdit;

    }
);
