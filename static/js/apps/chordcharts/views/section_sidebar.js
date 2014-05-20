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
                if (GLOBALS.edit) {
                    this.model.set('edit', true);
                }
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

                this.renderLetters();

                return this;

            },

            renderLetters: function() {

                var parts = [];
                var last_section = false;

                this.model.get('section').get('lines').each(function(section) {

                    /*if (last_section) {
                        if (last_section.get('letter') 
                    }

                    last_section = section;*/

                });

            }

        });

    }
);
