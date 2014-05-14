define(
    [
        'models/section_sidebar_part_edit',
        'views/section_sidebar_part_edit'
    ],
    function(
        SectionSidebarPartEdit,
        SectionSidebarPartEditView
    ) {

        var sectionSidebarPartEdit = new SectionSidebarPartEdit();

        new SectionSidebarPartEditView({
            el: '.chord-chart .subsection-sidebar-part-edit',
            model: sectionSidebarPartEdit
        });

        $('html').on('click', function(event) {

            // If the editwidget is visible, hide it if there was a
            // click outside it.

            if (sectionSidebarPartEdit.get('visible')) {

                var target = $(event.target);

                // Check if the click wasn't a click to open the widget,
                // or a click inside the widget.

                if (!(
                    (
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was to open the widget
                        target.closest('.subsection-sidebar-part')
                    ) || (
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was in the widget
                        target.closest('.subsection-sidebar-part-edit').length
                    )
                )) {
                    // close the widget
                    sectionSidebarPartEdit.set('visible', false);
                }

            }

        });

        return sectionSidebarPartEdit;

    }
);
