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
                this.listenTo(this.model, 'change', this.render);
            },

            mouseEnter: function() {
                this.model.set('edit', true);
            },

            mouseOut: function() {
                this.model.set('edit', false);
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
                        subsection: subsection,
                        section: that.model.get('section'),
                        edit: that.model.get('edit')
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
