define(
    ['models/chord_edit_note'],
    function(ChordEditNote) {

        return Backbone.View.extend({

            tagName: 'li',
            model: ChordEditNote,

            initialize: function() {
                this.listenTo(this.model, 'change', this.render)
            },

            events: {
                'click': 'chooseNote'
            },

            chooseNote: function() {
                // Sets the chosen note on the editWidget
                this.model.get('editWidget').set(
                    this.model.get('note_type'),
                    this.model.get('note'))
                return this
            },

            render: function() {

                this.$el.html(this.model.get('note').name)

                if(this.model.get('selected')) {
                    this.$el.addClass('selected')
                }
                else {
                    this.$el.removeClass('selected')
                }

                return this

            }

        })

    }
)
