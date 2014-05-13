define(
    [
        'models/line',
        'models/section_sidebar',
        'views/section_sidebar',
        'views/subsection',
        'init/section_edit'
    ],
    function(
        Line,
        SectionSidebar,
        SectionSidebarView,
        SubsectionView,
        SectionEdit
    ) {

        return Backbone.View.extend({

            tagName: 'section',
            className: 'section',

            initialize: function() {
                this.initListeners();
            },

            events: {
                'click .section-header .name': 'openSectionEdit',
                'click .section-header .section-edit-buttons .move-up': 'moveUp',
                'click .section-header .section-edit-buttons .move-down': 'moveDown',
                'click .section-header .section-edit-buttons .remove': 'removeSection',
                'click .line-add .plus': 'addLine',
            },

            initListeners: function() {
                this.stopListening();
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model.get('subsections'), 'lineRemoved', this.renderSidebar);
            },

            openSectionEdit: function(event) {

                SectionEdit.set({
                    visible: true,
                    section: this.model,
                    offset: $(event.target).offset()
                });

            },

            render: function() {
                this.renderHeader();
                this.renderSidebar();
                this.renderSubsections();
                return this;
            },

            renderHeader: function() {

                var template = _.template(
                    $('#template-section-header').html()
                );

                var section_header = template({
                    section_name: this.model.getName()
                });

                var section_header_el = this.$el.find('.section-header');

                if (section_header_el.length) {
                    section_header_el.replaceWith(section_header);
                } else {
                    this.$el.append(section_header);
                }

                if (this.model.get('number') == 1) {
                    this.$el.find(
                        '.section-header .section-edit-buttons .move-up'
                    ).hide();
                } else if (
                    this.model.get('number') == this.model.collection.length
                ) {
                    this.$el.find(
                        '.section-header .section-edit-buttons .move-down'
                    ).hide();
                }

            },

            renderSidebar: function() {

                var sectionSidebar = new SectionSidebar({
                    section: this.model,
                    edit: false
                });

                var sectionSidebarView = new SectionSidebarView({
                    model: sectionSidebar
                });

                var sectionSidebar_el = sectionSidebarView.render().el;
                var sidebar_el = this.$el.find('.section-sidebar');

                if (sidebar_el.length) {
                    sidebar_el.replaceWith(sectionSidebar_el);
                } else {
                    this.$el.append(sectionSidebar_el);
                }

            },

            renderSubsections: function() {

                var subsections_el = this.$el.find('.subsections');
                var subsections_template = _.template(
                    $('#template-subsections').html()
                );

                if (subsections_el.length) {
                    subsections_el.replaceWith(subsections_template());
                } else {
                    this.$el.append(subsections_template());
                }

                var that = this;
                var subsectionView;

                this.model.get('subsections').each(function(subsection) {

                    subsectionView = new SubsectionView({
                        model: subsection
                    });

                    subsectionView.render().$el.insertBefore(
                        that.$el.find('.line-add')
                    );

                });

            },

            moveUp: function() {

                this.$el.after(this.$el.prev());

                var this_section_number = this.model.get('number');

                var prev_section = this.model.collection.find(
                    function(section) {
                        return section.get('number') == this_section_number - 1;
                    }
                );

                var prev_section_number = prev_section.get('number');
                prev_section.set('number', this_section_number);
                this.model.set('number', prev_section_number);

                this.model.trigger('change:alt_name');
                prev_section.trigger('change:alt_name');

                this.model.save();
                prev_section.save();

            },

            moveDown: function() {

                this.$el.before(this.$el.next());

                var this_section_number = this.model.get('number');

                var next_section = this.model.collection.find(
                    function(section) {
                        return section.get('number') == this_section_number + 1;
                    }
                );

                var next_section_number = next_section.get('number');
                next_section.set('number', this_section_number);
                this.model.set('number', next_section_number);

                this.model.trigger('change:alt_name');
                next_section.trigger('change:alt_name');

                this.model.save();
                next_section.save();

            },

            /**
             * Adds a line to the last subsection in this section.
             */
            addLine: function() {

                var last_subsection = this.model.get('subsections').last();
                var last_line = last_subsection.get('lines').last();

                var new_line = last_line.copy({
                    number: last_line.get('number') + 1
                });

                var new_measure = new_line.get('measures').first().copy();

                new_measure.unset('next_measure');
                new_line.get('measures').reset([new_measure]);

                last_subsection.get('lines').add(new_line);

                this.renderSidebar();

                new_line.saveRecursive();

            },

            removeSection: function() {

                if (confirm("Are you sure you want to remove this section?")) {
                    this.model.destroy();
                    this.remove();
                }

            },

        });

    }
);
