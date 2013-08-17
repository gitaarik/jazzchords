define(
    ['collections/lines'],
    function(Lines) {

        return Backbone.Model.extend({

            initialize: function() {

                var that = this
                var lines = []
                _.each(this.get('lines'), function(line) {
                    line.section = that
                    lines.push(line)
                })

                this.set('lines', new Lines(lines))

            }

        })

    }
)
