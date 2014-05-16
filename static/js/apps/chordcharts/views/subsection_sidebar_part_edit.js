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

                /*

                If the user changes the letter of a line inside a
                subsection, then do this:

                - If this line is the only line in the subsection and:
                  If there is no preceding subsection or a preceding
                  subsection with a different letter than the chosen
                  one and:
                  If there is no following subsection or a following
                  subsection with a different letter than the chosen
                  one:
                    - Set the subsection's letter to the chosen letter.
                - Else:

                    - If this line has a preceding line:
                        - If this line has a following line:
                            - Upper `number` of following subsections.
                            - Create new subsection where `number` is
                              preceding subsection's number + 1.
                            - Move this line to the new subsection.
                        - Else, if this subsection has a following
                          subsection:
                            - 

                    - Else, if this subsection has a preceding
                      subsection and it's letter is the same as the
                      chosen letter:
                        - Move the line to the end of the preceding
                          subsection.
                        - If this subsection has lines left:
                            - Lower the `number` of the lines.
                        - Else:
                            - Remove this subsection
                            - Lower the `number` of the following
                              subsections.

                    - If this line has a following line:

                Bye bye subsections....?

                */

            }

        });

    }
);
