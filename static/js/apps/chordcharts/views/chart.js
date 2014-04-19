define(
    ['models/chart'],
    function(Chart) {

        return Backbone.View.extend({

            className: 'chart',

            events: {
                'click .section-new': 'createNewSection'
            },

            createNewSection: function() {

                var last_section = this.model.get('sections').last();

                var first_line = last_section.get('lines').first();
                var first_chord = first_line.get('measures').first();

                var new_lines = [
                    first_line.copy({
                        chords: [first_chord],
                    })
                ];

                var new_section = last_section.copy({
                    number: last_section.get('number') + 1,
                    alt_name: '',
                    lines: new_lines
                });

                console.log('new section:');
                console.log(new_section);

            },

        });

    }
);
