define(
    ['collections/sections', 'models/section'],
    function(Sections, Section) {

        return Backbone.Model.extend({

            initialize: function() {

                // Only set sections if it hasn't been set yet. Prevents errors
                // when cloning.
                if(!(this.get('sections') instanceof Backbone.Collection)) {

                    var that = this;
                    var sections = [];
                    var section;

                    _.each(this.get('sections'), function(section_data) {
                        section_data.chart = that;
                        section = new Section(section_data);
                        sections.push(section);
                    });

                    this.set('sections', new Sections(sections));

                }

            }

        });

    }
);
