define(
    ['models/edit_widget_note'],
    function(EditWidgetNote) {

        return Backbone.View.extend({
            tagName: 'li',
            model: EditWidgetNote,
            events: {
                'click': 'chooseNote'
            },
            chooseNote: function() {
                // Sets the chosen note on the editWidget
                this.model.get('editWidget').model.set('note',
                    this.model.get('note'))
            },
            render: function() {
                this.$el.html(this.model.get('note').name)
                return this
            }
        })

    }
)
