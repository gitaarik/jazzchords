define(
    [
        'models/subsection_sidebar_part_edit',
        'views/subsection_sidebar_part_edit'
    ],
    function(
        SubsectionSidebarPartEdit,
        SubsectionSidebarPartEditView
    ) {

        var subsectionSidebarPartEdit = new SubsectionSidebarPartEdit();

        new SubsectionSidebarPartEditView({
            el: '.chord-chart .subsection-sidebar-part-edit',
            model: subsectionSidebarPartEdit
        });

        $('html').on('click', function(event) {

            // If the editwidget is visible, hide it if there was a
            // click outside it.

            if (subsectionSidebarPartEdit.get('visible')) {

                var target = $(event.target);

                // Check if the click wasn't a click to open the widget,
                // or a click inside the widget.

                if (!(
                    (
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was to open the widget
                        target.closest('.subsection-sidebar-part').length
                    ) || (
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was in the widget
                        target.closest('.subsection-sidebar-part-edit').length
                    )
                )) {
                    // close the widget
                    console.log('closing the subsectionSidebarPartEditWidget');
                    subsectionSidebarPartEdit.set('visible', false);
                }

            }

        });

        return subsectionSidebarPartEdit;

    }
);
