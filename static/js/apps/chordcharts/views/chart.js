define(
    [
        'collections/lines',
        'collections/measures',
        'models/chart',
        'views/section'
    ],
    function(
        Lines,
        Measures,
        Chart,
        SectionView
    ) {

        return Backbone.View.extend({

            className: 'chart',

            events: {
                'click .section-new': 'createNewSection'
            },

            createNewSection: function() {

                var last_section = this.model.get('sections').last();

                var first_line = last_section.get('lines').first();
                var first_measure = first_line.get('measures').first();

                var new_lines = new Lines([
                    first_line.copy({
                        measures: new Measures([first_measure]),
                    })
                ]);

                var new_section = last_section.copy({
                    number: last_section.get('number') + 1,
                    alt_name: '',
                    lines: new_lines
                });

                console.log('new section:');
                console.log(new_section);

                this.model.get('sections').add(new_section);

                var sectionView = new SectionView({
                    model: new_section
                });

                console.log('new section view:');
                console.log(sectionView);

                sectionView.render().$el.insertBefore(
                    this.$el.find('.section-new')
                );

            },

        });

    }
);
