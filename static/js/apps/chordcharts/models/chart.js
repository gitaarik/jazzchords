define(
    ['collections/sections'],
    function(Sections) {

        return Backbone.Model.extend({
            initialize: function() {
                this.set('sections', new Sections(this.get('sections')))
            }
        })

    }
)
