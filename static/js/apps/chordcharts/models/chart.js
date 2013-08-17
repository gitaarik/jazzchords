define(
    ['collections/sections'],
    function(Sections) {

        return Backbone.Model.extend({

            initialize: function() {

                var that = this
                var sections = []
                _.each(this.get('sections'), function(section) {
                    section.chart = that
                    sections.push(section)
                })

                this.set('sections', new Sections(sections))

            }

        })

    }
)
