define(
    ['models/subsection_sidebar', 'views/subsection_sidebar'],
    function(SubsectionSidebar, SubsectionSidebarView) {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'section-sidebar',

            render: function() {

                this.$el.html('');
                this.$el.css({
                    'height': this.model.get('section').height(),
                    'width': this.model.get('section').get('chart')
                        .get('section_sidebar_width')
                });

                if (this.model.get('section').get('use_subsections')) {
                    this.renderSubsections();
                }

                return this;

            },

            renderSubsections: function() {

                var that = this;

                this.model.get('section').get('subsections').each(function(subsection) {

                    var subsectionSidebar = new SubsectionSidebar({
                        subsection: subsection,
                        section: that.model.get('section')
                    });

                    var subsectionSidebarView = new SubsectionSidebarView({
                        model: subsectionSidebar
                    });

                    that.$el.append(subsectionSidebarView.render().el);

                });

            },

        });

    }
);
