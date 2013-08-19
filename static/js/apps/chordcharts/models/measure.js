define(
    ['collections/chords'],
    function(Chords) {

        return Backbone.Model.extend({

            initialize: function() {

                var that = this
                var chords = []
                _.each(this.get('chords'), function(chord) {
                    chord.measure = that
                    chords.push(chord)
                })

                this.set('chords', new Chords(chords))

                this.listenTo(this, 'change', this.change)

            },

            change: function() {

                if(this.hasChanged('beat_schema')) {
                    this.updateBeatSchema()
                    this.renderNextMeasure()
                }

            },

            updateBeatSchema: function() {
                // Changes the beatschema to given value and reset's the chords
                // according to the current beat_schema.
                //
                // It will set the chords' correct beats and will remove
                // overflowing chords or add missing chords.

                var that = this
                var beats_set = this.get('beat_schema').split('-')
                var last_chord
                var new_chord = false
                var new_chords = []
                var new_chord_views = []

                _.each(beats_set, function(beats, index) {

                    var chord = that.get('chords').at(index)

                    if(!chord) {
                        chord = last_chord.clone()
                        new_chord = true
                    }
                    else {
                        new_chord = false
                    }

                    chord.set({
                        beats: parseInt(beats),
                        order: index + 1
                    })

                    if(new_chord) {
                        new_chords.push(chord)
                    }

                    last_chord = chord

                })

                if(new_chords.length) {
                    this.get('chords').add(new_chords)
                }

            },

            renderNextMeasure: function() {

                if(
                    this.has('next_measure') &&
                    this.get('next_measure').get('beat_schema') == "4"
                ) {
                    // Trigger the `render()` by setting timestamp in
                    // milliseconds in `changed` attribute. Then `render()`
                    // will show or remove the repeat sign ( % ).
                    this.get('next_measure').get('chords').first()
                        .set('changed', new Date().getTime())
                }

            },

        })

    }
)
