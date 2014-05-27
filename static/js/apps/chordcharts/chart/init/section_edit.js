define(
    ['models/section_edit', 'views/section_edit'],
    function(SectionEdit, SectionEditView) {

        var sectionEdit = new SectionEdit();

        new SectionEditView({
            el: '.chord-chart .section-edit',
            model: sectionEdit
        });

        $('html').on('click', function(event) {

            // close the edit widget if there was a click outside the edit widget

            if(sectionEdit.get('visible')) {

                var target = $(event.target);

                // check if the click wasn't a click to open the widget, or a click
                // inside the widget

                if(!(
                    (
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was inside the section header
                        target.closest('.section-header').length &&
                        // click was to open the widget
                        target.hasClass('name')
                    ) || (
                        // click was inside chord chart
                        target.closest('.chord-chart').length &&
                        // click was in the widget
                        target.closest('.section-edit').length
                    )
                )) {
                    // close the widget
                    sectionEdit.set('visible', false);
                }

            }

        });

        return sectionEdit;

    }
);
