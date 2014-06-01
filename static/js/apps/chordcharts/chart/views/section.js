define(
    [
        'models/line',
        'models/section_sidebar',
        'views/section_sidebar',
        'views/line',
        'init/section_edit'
    ],
    function(
        Line,
        SectionSidebar,
        SectionSidebarView,
        LineView,
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
                this.listenTo(this.model.get('lines'), 'remove', this.renderSidebar);
            },

            openSectionEdit: function(event) {

                if (!GLOBALS.edit) {
                    return;
                }

                SectionEdit.set({
                    visible: true,
                    section: this.model,
                    offset: $(event.target).offset()
                });

            },

            render: function() {

                var template = _.template(
                    $('#template-section').html()
                );

                this.$el.html(template());

                this.renderHeader();
                this.renderSidebar();
                this.renderLines();

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
                section_header_el.html(section_header);

                var edit_buttons_el = this.$el.find(
                    '.section-header .section-edit-buttons'
                );

                if (
                    this.model.collection.size() == 1 ||
                    this.model.get('number') == 1
                ) {
                    edit_buttons_el.find('.move-up').hide();
                }

                if (
                    this.model.collection.size() == 1 ||
                    this.model.get('number') == this.model.collection.length
                ) {
                    edit_buttons_el.find('.move-down').hide();
                }

                if (this.model.collection.size() == 1) {
                    console.log('removing that shit');
                    edit_buttons_el.find('.remove').hide();
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

                this.$el.find('.section-sidebar').replaceWith(
                    sectionSidebarView.render().el
                );

            },

            renderLines: function() {

                var lineViews = [];
                var lineView;

                this.model.get('lines').each(function(line) {

                    lineView = new LineView({
                        model: line
                    });

                    lineViews.push(lineView.render().el);

                });

                var lines_el = this.$el.find('.lines');

                lines_el.html('');
                lines_el.append(lineViews);

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
                this.model.collection.sort();

                this.model.trigger('change');
                prev_section.trigger('change');

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
                this.model.collection.sort();

                this.model.trigger('change');
                next_section.trigger('change');

                this.model.save();
                next_section.save();

            },

            /**
             * Adds a line in this section.
             */
            addLine: function() {

                var last_line = this.model.get('lines').last();
                var new_line = last_line.copy({
                    number: last_line.get('number') + 1
                });

                var new_measure = new_line.get('measures').first().copy();

                new_measure.unset('next_measure');
                new_line.get('measures').reset([new_measure]);

                this.model.get('lines').add(new_line);
                this.render();
                new_line.saveRecursive();

            },

            removeSection: function() {

                if (confirm("Are you sure you want to remove this section?")) {

                    var collection = this.model.collection;

                    this.model.destroy();
                    this.remove();

                    collection.resetNumbers();

                    if (collection.size() == 1) {
                        // If there is only one section left, the move
                        // and remove buttons should be removed. So we
                        // trigger a 'change' event so that it will
                        // rerender itself.
                        collection.first().trigger('change');
                    }

                }

            },

        });

    }
);
