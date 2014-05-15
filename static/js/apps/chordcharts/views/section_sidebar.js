define(
    ['models/subsection_sidebar', 'views/subsection_sidebar'],
    function(SubsectionSidebar, SubsectionSidebarView) {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'section-sidebar',

            initialize: function() {
                this.initListeners();
            },

            events: {
                'mouseenter': 'mouseEnter',
                'mouseout': 'mouseOut'
            },

            initListeners: function() {
                this.stopListening();
                this.listenTo(this.model, 'change', this.change);
            },

            mouseEnter: function() {
                if (GLOBALS.edit) {
                    this.model.set('edit', true);
                }
            },

            mouseOut: function() {
                this.model.set('edit', false);
            },

            change: function() {

                var changedKeys = Object.keys(this.model.changedAttributes());

                // If only `forceEdit` was changed, don't render the view.
                if (!(
                    changedKeys.length == 1 &&
                    changedKeys[0] == 'forceEdit'
                )) {
                    this.render();
                }

            },

            render: function() {

                this.$el.html('');
                this.$el.css({
                    'height': this.model.get('section').height(),
                    'width': GLOBALS.settings.section_sidebar_width
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
                        sectionSidebar: that.model,
                        subsection: subsection,
                        section: that.model.get('section'),
                        edit: that.model.get('edit') | that.model.get('forceEdit')
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
