var Measure = require('../models/_measure.js');
var measureEdit = require('../init/_measure-edit.js');
var MeasureWidget = require('../../../core/widgets/_measure.js');
var ChordView = require('./_chord.js');


module.exports = Backbone.View.extend({

    tagName: 'td',
    className: 'measure',
    model: Measure,

    initialize: function() {

        if (!this.$el.find('.chords').length) {
            this.$el.html('<div class="chords"></div>');
        }

        this.chords = this.$el.find('.chords');

        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);

    },

    events: {
        'click': 'openMeasureEdit'
    },

    openMeasureEdit: function(event) {

        if (!GLOBALS.edit) {
            return;
        }

        if ($(event.target).closest('.chord-name').length) {
            // If the click was on a chord name, the chord edit widget
            // should open and not the measure edit widget.
            return;
        }

        // If the measure edit widget is already open for this measure
        // then close it, otherwise open it.
        if (
            measureEdit.get('visible') &&
            measureEdit.get('measure') == this.model
        ) {
            measureEdit.set('visible', false);
        } else {

            // Don't allow to remove the measure if it's the
            // last measure in the last line.
            if (
                this.model.get('line').get('measures').length == 1 &&
                this.model.get('line').get('section').get('lines').length == 1
            ) {
                remove_possible = false;
            } else {
                remove_possible = true;
            }

            measureEdit.set({
                'visible': true,
                'measure': this.model,
                'measure_el': this.$el,
                'beat_schema': this.model.get('beat_schema'),
                'remove_possible': remove_possible
            });

        }

    },

    render: function() {
        this.chords.html('');
        this.drawChords();
        this.drawSeperationLines();
        return this;
    },

    drawChords: function() {

        this.$el.removeClass('measure-beatschema-' +
            this.model.previousAttributes().beat_schema
        );
        this.$el.addClass('measure-beatschema-' + 
            this.model.get('beat_schema')
        );

        var that = this;
        var beats = this.model.get('beat_schema').split('-');

        _.each(beats, function(chord, i) {

            that.chords.append(
                new ChordView({
                    model: that.model.get('chords').at(i)
                }).render().el
            );

        });

    },

    drawSeperationLines: function() {
        // Draws the lines that seperate the different measure parts
        // inside the measure

        this.$el.find('canvas').remove();

        new MeasureWidget(
            this.$el,
            this.model.get('beat_schema'),
            GLOBALS.settings.box_width,
            GLOBALS.settings.box_height,
            GLOBALS.settings.border_width
        ).measure_draw_separation_lines();

    }

});
