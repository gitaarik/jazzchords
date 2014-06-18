define(
    [],
    function() {

        return Backbone.View.extend({

            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            events: {
                'click .closed': 'toggle',
                'click .open .current-key': 'toggle',
                'change .open .set-as-default-key input': 'defaultKeyFlagChanged'
            },

            toggle: function() {
                console.log('togglin');
                this.model.set('visible', !this.model.get('visible'));
            },

            defaultKeyFlagChanged: function(event) {

                this.$el.find('.open ul li a').each(function() {

                    var href = $(this).attr('href');
                    href = href.replace(
                        /\?set-default-key=[0-9]/,
                        '?set-default-key=' + (event.target.checked ? '1' : '0')
                    );
                    $(this).attr('href', href);

                });

            },

            render: function() {

                if(this.model.get('visible')) {
                    this.$el.find('.open').show();
                }
                else {
                    this.$el.find('.open').hide();
                }

            }

        });

    }
);
