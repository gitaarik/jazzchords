var MeasureEditMeasures = require('../collections/_measure-edit-measures.js');
var MeasureEdit = require('../models/_measure-edit.js');
var MeasureEditMeasure = require('../models/_measure-edit-measure.js');
var MeasureEditMeasureView = require('./_measure-edit-measure.js');


module.exports = Backbone.View.extend({

    model: MeasureEdit,

    initialize: function() {
        this.initMeasures();
        this.listenTo(this.model, 'change', this.change);
    },

    events: {
        'click .close': 'close',
        'click .remove': 'removeMeasure'
    },

    close: function() {
        this.model.set('visible', false);
    },

    removeMeasure: function() {
        this.model.get('measure').remove();
        this.close();
    },

    change: function() {

        if (this.model.get('visible')) {

            // Only set the beat_schema on the measure if the edit
            // widget is visible.
            if (this.model.previousAttributes().visible) {

                this.model.get('measure').set(
                    'beat_schema',
                    this.model.get('beat_schema')
                );

                this.model.get('measure').saveRecursive();

            }

            this.show();

        } else {
            this.$el.hide();
        }

    },

    initMeasures: function() {
        // Creates the measures that will be the choices in the edit
        // widget to change the measure.

        var that = this;
        var beat_schemas = ['4', '2-2', '2-1-1', '1-1-2', '1-1-1-1'];
        var measures = [];
        var measureViews = [];
        var measure;

        _.each(beat_schemas, function(beat_schema) {

            measure = new MeasureEditMeasure({
                beat_schema: beat_schema,
                measureEdit: that.model
            });
            measures.push(measure);

            measureViews.push(new MeasureEditMeasureView({
                model: measure
            }).render().el);

        });

        this.model.set('measures', new MeasureEditMeasures(measures));
        this.$el.find('.measures').append(measureViews);

    },

    show: function() {

        var measure = this.model.get('measure_el');

        this.$el.css({
            'top': measure.offset().top + measure.height() + 10,
            'left': measure.offset().left - 10
        });

        var current_selected = this.model.get('measures').findWhere({
            'selected': true
        });

        if (current_selected) {
            current_selected.set('selected', false);
        }

        this.model.get('measures').findWhere({
            'beat_schema': this.model.get('beat_schema')
        }).set('selected', true);

        if (this.model.get('remove_possible')) {
            this.$el.find('.remove').show();
        } else {
            this.$el.find('.remove').hide();
        }

        this.$el.show();

    }

});
