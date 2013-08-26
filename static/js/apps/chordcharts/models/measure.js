define(
    ['collections/chords'],
    function(Chords) {

        return Backbone.Model.extend({

            initialize: function() {

                // Only set chords if it hasn't been set yet. Prevents errors
                // when cloning.
                if(!(this.get('chords') instanceof Backbone.Collection)) {

                    var that = this
                    var chords = []
                    _.each(this.get('chords'), function(chord) {
                        chord.measure = that
                        chords.push(chord)
                    })

                    this.set('chords', new Chords(chords))

                }

                this.initPrevMeasureListener()
                this.initNextMeasureListener()
                this.listenTo(this, 'change', this.change)
                this.listenTo(this.get('chords'), 'change', function() {
                    console.log('chords change!')
                })

            },

            change: function() {

                if(this.hasChanged('beat_schema')) {
                    this.updateBeatSchema()
                }

                // If the number of this measure changed, then set the number
                // of the next measure to this one + 1 (which will go on as
                // long as there's a next measure).
                if(this.hasChanged('number')) {

                    if(this.has('next_measure')) {
                        this.get('next_measure').set(
                            'number', this.get('number') + 1)
                    }

                }

                this.initPrevMeasureListener()
                this.initNextMeasureListener()

            },

            initPrevMeasureListener: function() {
                // Will initialize the listener on the previous measure, if it
                // exists. Will remove old listeners if they are set.

                if(this.prev_measure) {
                    this.stopListening(this.prev_measure)
                }

                if(this.has('prev_measure')) {

                    this.prev_measure = this.get('prev_measure')

                    this.listenTo(this.prev_measure, 'remove', function() {

                        if(this.prev_measure.has('prev_measure')) {
                            this.set('prev_measure', this.prev_measure.get('prev_measure'))
                        }
                        else {
                            this.unset('prev_measure')
                        }

                    })

                    console.log('init prev measure change listener')
                    this.listenTo(this.prev_measure, 'change', function() {
                        console.log('prev measure has changed')
                        this.trigger('prevMeasureChanged')
                    })

                }

            },

            initNextMeasureListener: function() {

                if(this.next_measure) {
                    this.stopListening(this.next_measure, 'remove')
                }

                if(this.has('next_measure')) {

                    this.next_measure = this.get('next_measure')

                    this.listenTo(this.next_measure, 'remove', function() {

                        if(this.next_measure.has('next_measure')) {
                            this.set('next_measure', this.next_measure.get('next_measure'))
                        }
                        else {
                            this.unset('next_measure')
                        }

                    })

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

            remove: function() {
                this.collection.delete(this)
            },

            copy: function(attributes) {

                var copy = this.clone()
                copy.set('chords', this.get('chords').copy({ measure: copy }))

                if(attributes) {
                    copy.set(attributes)
                }

                return copy

            }

        })

    }
)
