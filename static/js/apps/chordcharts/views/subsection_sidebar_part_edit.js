define(
    [],
    function() {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'subsection-sidebar-part-edit',

            initialize: function() {
                this.initListeners();
            },

            initListeners: function() {
                this.stopListening();
                this.listenTo(this.model, 'change', this.render);
            },

            events: {
                'click .letters li': 'chooseLetter'
            },

            render: function() {

                // Only show the edit widget when 'visible' is true,
                // otherwise, hide the edit widget.

                if (this.model.get('visible')) {
                    this.show();
                } else {
                    this.$el.hide();
                }

                return this;

            },

            show: function() {

                var offset = this.offset();

                this.$el.css({
                    'top': offset.top,
                    'left': offset.left
                });

                this.$el.show();

            },

            /**
             * Returns the offset of the widget.
             */
            offset: function() {

                var offset = {
                    top: this.model.get('offset').top,
                    left: this.model.get('offset').left
                };

                offset.top += GLOBALS.settings.box_height / 2 + 30;
                offset.left += GLOBALS.settings.section_sidebar_width / 2 - 30;

                return offset;

            },

            chooseLetter: function(event) {

                var letter = event.target.getAttribute('data-letter');

                console.log('choosing letter:');
                console.log(letter);

            }

        });

    }
);
