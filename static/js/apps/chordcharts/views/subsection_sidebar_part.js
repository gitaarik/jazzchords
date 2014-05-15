define(
    ['init/subsection_sidebar_part_edit'],
    function(subsectionSidebarPartEdit) {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'subsection-sidebar-part',

            events: {
                'click': 'openSubsectionSidebarLetterEditWidget'
            },

            render: function() {

                var subsection_sidebar_part_template = _.template(
                    $('#template-subsection-sidebar-part').html()
                );

                var height;

                if (this.model.get('edit')) {
                    height = GLOBALS.settings.box_height;
                } else {
                    height = this.model.get('subsection').height();
                }

                this.$el.html(subsection_sidebar_part_template({
                    letter: this.model.get('subsection').letter(),
                    height: height,
                    edit: this.model.get('edit')
                }));

                return this;

            },

            openSubsectionSidebarLetterEditWidget: function() {

                subsectionSidebarPartEdit.set({
                    visible: true,
                    subsection: this.model.get('subsection'),
                    offset: this.$el.offset()
                });

                this.model.get('subsectionSidebar').get('sectionSidebar')
                    .set('forceEdit', true);

            },

        });

    }
);
