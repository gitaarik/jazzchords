define(
    ['models/box_part'],
    function(BoxPart) {

        return Backbone.View.extend({

            model: BoxPart,

            initialize: function() {
                this.listenTo(this.model, 'change', this.render)
            },

            events: {
                'click .chord-name': 'openEditWidget'
            },

            openEditWidget: function() {
                // Opens the edit widget for this boxPart

                var chord_name = this.$el.find('.chord-name')

                this.model.get('editWidget').set({
                    visible: true,
                    boxPart: this.model,
                    chord_name_offset: chord_name.offset(),
                    font_size: chord_name.css('font-size'),
                    letter_spacing: chord_name.css('letter-spacing')
                })

            },

            chartOutput: function() {
                // Returns the string that should be outputted on the chart. This
                // is usually the chordName but in some cases the repeat sign ( % )

                // If this box and the previous box's box_schema are both '4' and
                // are on the same line and had the same chord, use the repeat sign
                // ( % ). Otherwise use the chordName.
                if(
                    this.model.get('beats') == 4 &&
                    this.model.get('box').has('prev_box') &&
                    this.model.get('box').get('line') == this.model.get('box')
                        .get('prev_box').get('line') &&
                    this.model.get('box').get('prev_box')
                        .get('beat_schema') == '4' &&
                    this.model.get('box').get('prev_box').get('parts')
                    .first().chordName() == this.model.chordName()
                ) {
                    return '%'
                }
                else {
                    return this.model.chordName()
                }

            },

            render: function() {
                this.$el.find('.chord-name').html(this.chartOutput())
            }

        })

    }
)
