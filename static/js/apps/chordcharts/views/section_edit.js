define(
    [
        'models/section',
    ],
    function(
        Section
    ) {

        return Backbone.View.extend({

            model: Section,

            events: {
                'change input[type=radio]': 'changeSectionName',
                'click input[type=radio]': 'changeSectionName',
                'keyup .custom-name-input': 'customNameChanged',
                'click .close': 'close'
            },

            initialize: function() {
                this.listenTo(this.model, 'change', this.change);
            },

            change: function() {

                if (this.model.get('visible')) {
                    this.show();
                } else {
                    this.$el.hide();
                    var section = this.model.get('section');
                    section.save();
                }

            },

            close: function() {
                this.model.set('visible', false);
            },

            show: function() {

                this.$el.css({
                    'top': this.model.get('offset').top + 42,
                    'left': this.model.get('offset').left - 15
                });

                this.$el.find('.custom-name-input').val(
                    this.model.get('section').get('alt_name')
                );
                this.$el.find('.sequence-letter').html(
                    this.model.get('section').getSequenceLetter()
                );

                if (this.model.get('section').get('alt_name')) {
                    this.$el.find('.custom-name-radio').prop('checked', true);
                } else {
                    this.$el.find('.sequence-letter-radio').prop('checked', true);
                }

                this.$el.show();

                if (this.model.get('section').get('alt_name')) {

                    var custom_name_input = this.$el.find('.custom-name-input');

                    // set focus on text field
                    custom_name_input.focus();

                    // make sure the cursor is at the end
                    var orig_value = custom_name_input.val();
                    custom_name_input.val('');
                    custom_name_input.val(orig_value);

                }

            },

            changeSectionName: function() {

                if (this.$el.find('.custom-name-radio:checked').length) {

                    this.model.get('section').set(
                        'alt_name', 
                        this.$el.find('.custom-name-input').val()
                    );

                    this.$el.find('.custom-name-input').focus();

                } else if (this.$el.find('.sequence-letter-radio:checked').length) {
                    this.model.get('section').set('alt_name', '');
                }

            },

            customNameChanged: function(event) {
                this.changeSectionName();
                if (event.key == 'Enter') {
                    this.close();
                }
            }

        });

    }
);
