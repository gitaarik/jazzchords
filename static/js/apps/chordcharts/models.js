BoxedChart.Models = {}

BoxedChart.Models.ChordType = Backbone.Model.extend()

BoxedChart.Models.BoxPart = Backbone.Model.extend({

    initialize: function(attributes) {

        this.set('chord_type', new BoxedChart.Models.ChordType(
            this.get('chord_type')))

        this.listenTo(this, 'change', this.parse_next_box)

    },

    parse_next_box: function() {
        // Parses the next box based on this box
        //
        // If this and the next box are on the same line and both have
        // beat_schema '4' then:
        // - If the chords are the same NOW, then next box will display the
        //   repeat sign ( % ).
        // - If the chord before the change of this box and the next chord
        //   were the same, then change the chord of the next box to the
        //   chord of the current box.

        if(
            this.get('beats') == 4 &&
            this.get('box').has('next_box') &&
            this.get('box').get('next_box').get('beat_schema') == '4' &&
            this.get('box').get('line') == this.get('box').get('next_box').get('line')
        ) {

            var next_box_part = this.get('box').get('next_box')
                .get('parts').first()

            if(
                // Check if chords are the same NOW
                _.isEqual(next_box_part.get('note'), this.attributes.note) &&
                _.isEqual(next_box_part.get('chord_type'), this.attributes.chord_type) &&
                _.isEqual(next_box_part.get('alt_bass_note'), this.attributes.alt_bass_note)
            ) {
                // Trigger the `render()` by setting timestamp in
                // milliseconds in `changed` attribute
                this.get('box').get('next_box').get('parts').first()
                    .set('changed', new Date().getTime())
            }
            else {

                var prev_attr = this.previousAttributes()

                if(
                    // Check if the current box's chord before the change
                    // is the same as the next box's chord
                    _.isEqual(next_box_part.get('note'), prev_attr.note) &&
                    _.isEqual(next_box_part.get('chord_type').attributes,
                        prev_attr.chord_type.attributes) &&
                    _.isEqual(next_box_part.get('alt_bass_note'),
                        prev_attr.alt_bass_note)
                ) {
                    this.get('box').get('next_box').get('parts').first().set({
                        'note': this.get('note'),
                        'chord_type': this.get('chord_type'),
                        'alt_bass_note': this.get('alt_bass_note')
                    })
                }

            }

        }

    },

    chordName: function() {
        // Returns the full chord name for this boxPart

        var bass_note
        if(this.get('alt_bass_note')) {
            bass_note = '/' + this.get('alt_bass_note').name
        }
        else {
            bass_note = ''
        }

        return this.get('note').name +
            this.get('chord_type').get('chord_output') + bass_note

    }

})

BoxedChart.Models.Box = Backbone.Model.extend({
    initialize: function() {
        this.set('parts', new BoxedChart.Collections.BoxPart(
            this.get('parts')))
    }
})

BoxedChart.Models.Line = Backbone.Model.extend({
    initialize: function() {
        this.set('boxes', new BoxedChart.Collections.Box(
            this.get('boxes')))
    }
})

BoxedChart.Models.Section = Backbone.Model.extend({
    initialize: function() {
        this.set('lines', new BoxedChart.Collections.Line(
            this.get('lines')))
    }
})

BoxedChart.Models.BoxedChart = Backbone.Model.extend({
    initialize: function() {
        this.set('sections', new BoxedChart.Collections.Section(
            this.get('sections')))
    }
})

BoxedChart.Models.editWidget = Backbone.Model.extend({

    chordName: function() {
        // Returns the chordName for this editWidget

        var bass_note
        if(this.get('alt_bass_note')) {
            bass_note = '/' + this.get('alt_bass_note').name
        }
        else {
            bass_note = ''
        }

        return this.get('note').name +
            this.get('chord_type').get('chord_output') + bass_note

    },

})

BoxedChart.Models.editWidgetNote = Backbone.Model.extend()
