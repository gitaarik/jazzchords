define(
    [],
    function() {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'line-edit',

            initialize: function() {
                this.initListeners();
            },

            initListeners: function() {
                this.stopListening();
                this.listenTo(this.model, 'change', this.render);
            },

            events: {
                'click .letters li': 'chooseLetter',
                'click .disable-sidebar': 'disableSidebar',
                'click .header .close': 'hide'
            },

            render: function() {

                // Only show the edit widget when 'visible' is true,
                // otherwise, hide the edit widget.

                if (this.model.get('visible')) {
                    this.show();
                } else {
                    this.hide();
                }

                return this;

            },

            show: function() {

                var offset = this.offset();

                this.$el.css({
                    top: offset.top,
                    left: offset.left
                });

                this.$el.find('.letters li').removeClass('selected');

                this.$el.find(
                    '.letters li[' +
                        'data-letter=' +
                        this.model.get('line').get('letter') +
                    ']'
                ).addClass('selected');

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

            hide: function() {

                var onClose = this.model.get('onClose');

                if (onClose) {
                    // Call `onClose()` callback function if it is
                    // defined.
                    onClose();
                }

                this.$el.hide();

            },

            chooseLetter: function(event) {

                var letter = event.target.getAttribute('data-letter');
                var line = this.model.get('line');

                line.set('letter', letter);
                line.save();

                this.render();
                this.model.get('section_sidebar').trigger('change');

            },

            disableSidebar: function() {

                var section = this.model.get('section');
                section.set('show_sidebar', false);
                section.save();

                this.hide();

            }

        });

    }
);
