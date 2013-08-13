define(
    ['models/measure_edit_measure'],
    function(MeasureEditMeasure) {

        return Backbone.View.extend({

            model: MeasureEditMeasure,

            render: function() {

                this.$el.html(
                    '<li>' +
                        '<div class="measure measure-beatschema-' + this.model.get('beat_schema') + '"></div>' +
                    '</li>'
                )

                return this

            }

        })

    }
)
