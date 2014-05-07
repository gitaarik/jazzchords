define(
    ['models/subsection_sidebar', 'views/subsection_sidebar'],
    function(SubsectionSidebar, SubsectionSidebarView) {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'section-sidebar',

            render: function() {

                console.log('render section sidebar!');

                var that = this;
                this.$el.html('');

                this.$el.html(_.template(
                    $('#template-section-sidebar').html()
                )());

                this.$el.css(
                    'height',
                    this.model.get('section').height()
                );

                this.$el.find('.section-sidebar-letter').css(
                    'line-height',
                    this.model.get('section').height() + 'px'
                );

                if (this.model.get('section').get('alt_name')) {
                    this.$el.find('.section-sidebar-letter').html('');
                    this.$el.find('.section-sidebar canvas').remove();
                } else {
                    this.$el.find('.section-sidebar-letter').html(
                        this.model.get('section').getSequenceLetter()
                    );
                }

                this.model.get('section').get('subsections').each(function(subsection) {

                    var subsectionSidebar = new SubsectionSidebar({
                        subsection: subsection,
                        section: that.model
                    });

                    var subsectionSidebarView = new SubsectionSidebarView({
                        model: subsectionSidebar
                    });

                    that.$el.append(subsectionSidebarView.render().el);

                });

                return this;

            },

        });

    }
);
