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
                'change input[type=radio]': 'changeSectionName'
            },

            initialize: function() {
                this.listenTo(this.model, 'change', this.change);
            },

            change: function() {

                if (this.model.get('visible')) {
                    this.show();
                } else {
                    this.$el.hide();
                }

            },

            show: function() {

                this.$el.css({
                    'top': this.model.get('offset').top + 42,
                    'left': this.model.get('offset').left - 15
                });

                if (this.model.get('section').get('alt_name')) {
                    this.$el.find('.custom-name-radio').prop('checked', true);
                } else {
                    this.$el.find('.sequence-letter-radio').prop('checked', true);
                }

                this.$el.find('.custom-name').val(
                    this.model.get('section').get('alt_name')
                );
                this.$el.find('.sequence-letter').html(
                    this.model.get('section').getSequenceLetter()
                );

                this.$el.show();

            },

            changeSectionName: function(zorz, ho) {

                if (this.$el.find('.custom-name-radio:checked').length) {

                    this.model.get('section').set(
                        'alt_name', 
                        this.$el.find('.custom-name').val()
                    );

                } else if (this.$el.find('.sequence-letter-radio:checked').length) {
                    this.model.get('section').set('alt_name', '');
                }

            }

        });

    }
);
