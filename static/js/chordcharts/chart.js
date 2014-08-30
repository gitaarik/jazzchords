(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Chart = require('./models/chart.js');
var ChartView = require('./views/chart.js');
var SectionView = require('./views/section.js');
var LineView = require('./views/line.js');
var MeasureView = require('./views/measure.js');
var ChordView = require('./views/chord.js');

require('./init/song_name_change_widget.js');
require('./init/transpose_widget.js');
require('./init/settings_widget.js');
require('./init/help_widget.js');


// Bind data from server to models/collections

var chart = new Chart(GLOBALS.chart_data);


// Bind views and models to existing HTML

var chartView = new ChartView({
    el: '.chord-chart .chart',
    model: chart
});

var section_number = 0;

// Loop through HTML elements and create appropriate views/models for these
// elements
chartView.$el.find('.section').each(function() {

    var line_number = 0;
    var section = chart.get('sections').models[section_number];
    var sectionView = new SectionView({
        el: this,
        model: section
    });
    chartView.$el.append(sectionView);

    sectionView.$el.find('.lines .line').each(function() {

        var measure_number = 0;
        var line = section.get('lines').models[line_number];
        var lineView = new LineView({
            el: this,
            model: line
        });
        sectionView.$el.append(lineView);

        lineView.$el.find('.measure').each(function() {

            var chord_number = 0;
            var measure = line.get('measures').models[measure_number];
            var measureView = new MeasureView({
                el: this,
                model: measure
            });

            lineView.$el.append(measureView);
            measureView.drawSeperationLines();
            var chord_views = [];

            measureView.$el.find('.chord').each(function() {

                var chord = measure.get('chords').models[chord_number];

                chord_views.push(
                    new ChordView({
                        el: this,
                        model: chord
                    })
                );
                chord_number++;

            });

            measure.set({ chord_views: chord_views }, { silent: true });
            measure_number++;

        });

        line_number++;

    });

    sectionView.renderSidebar();
    section_number++;

});

GLOBALS.parsed = true;

},{"./init/help_widget.js":12,"./init/settings_widget.js":16,"./init/song_name_change_widget.js":17,"./init/transpose_widget.js":18,"./models/chart.js":19,"./views/chart.js":37,"./views/chord.js":38,"./views/line.js":42,"./views/measure.js":44,"./views/section.js":47}],2:[function(require,module,exports){
var ChordEditChordType = require('../models/chord_edit_chord_type.js');


module.exports = Backbone.Collection.extend({
    model: ChordEditChordType
});

},{"../models/chord_edit_chord_type.js":23}],3:[function(require,module,exports){
var ChordEditNote = require('../models/chord_edit_note.js');


module.exports = Backbone.Collection.extend({
    model: ChordEditNote
});

},{"../models/chord_edit_note.js":24}],4:[function(require,module,exports){
var ChordType = require('../models/chord_type.js');


module.exports = Backbone.Collection.extend({
    model: ChordType
});

},{"../models/chord_type.js":25}],5:[function(require,module,exports){
var Chord = require('../models/chord.js');


module.exports = Backbone.Collection.extend({

    model: Chord,

    copy: function(attributes) {

        var copy = this.clone();
        var chord_copy;
        var chords_copies = [];

        copy.each(function(chord) {
            chord_copy = chord.copy(attributes);
            chords_copies.push(chord_copy);
        });

        copy.reset(chords_copies);

        return copy;

    }

});

},{"../models/chord.js":21}],6:[function(require,module,exports){
var Line = require('../models/line.js');


module.exports = Backbone.Collection.extend({

    model: Line,

    copy: function(attributes) {

        var copy = this.clone();
        var line_copy;
        var line_copies = [];

        copy.each(function(line) {
            line_copy = line.copy(attributes);
            line_copies.push(line_copy);
        });

        copy.reset(line_copies);

        return copy;

    }

});

},{"../models/line.js":26}],7:[function(require,module,exports){
var MeasureEditMeasure = require('../models/measure_edit_measure.js');


module.exports = Backbone.Collection.extend({
    model: MeasureEditMeasure
});

},{"../models/measure_edit_measure.js":30}],8:[function(require,module,exports){
var Measure = require('../models/measure.js');


module.exports = Backbone.Collection.extend({

    model: Measure,

    initPrevNextMeasures: function() {

        var prev_measure = null;

        this.each(function(measure) {

            if (prev_measure) {
                prev_measure.set('next_measure', measure);
                measure.set('prev_measure', prev_measure);
            }

            prev_measure = measure;

        });

    },

    copy: function(attributes) {

        var copy = this.clone();
        var measure_copy;
        var measure_copies = [];
        var prev_measure;

        copy.each(function(measure) {
            measure_copy = measure.copy(attributes);
            measure_copies.push(measure_copy);
        });

        copy.reset(measure_copies);
        copy.initPrevNextMeasures(copy.models);

        return copy;

    }

});

},{"../models/measure.js":28}],9:[function(require,module,exports){
var Section = require('../models/section.js');


module.exports = Backbone.Collection.extend({

    model: Section,

    comparator: 'number',

    /**
     * Resets the numbers on the sections.
     *
     * Will take the current order of the sections and reset the
     * `number` field, starting with 1 and counting up.
     */
    resetNumbers: function() {

        var number = 1;

        this.each(function(section) {
            section.set('number', number++);
            section.save();
        });

    }

});

},{"../models/section.js":31}],10:[function(require,module,exports){
var ChordEdit = require('../models/chord_edit.js');
var ChordEditView = require('../views/chord_edit.js');


var chordEdit = new ChordEdit();

new ChordEditView({
    el: '.chord-chart .chord-edit',
    model: chordEdit
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (chordEdit.get('visible')) {

        var target = $(event.target);

        // Check if the click wasn't a click to open the widget,
        // or a click inside the widget.
        if (
            !(
                target.closest('.chord-chart').length &&
                target.hasClass('chord-name')
            ) &&
            !target
                .closest('.chord-edit')
                .closest('.chord-chart')
                .length
        ) {
            // close the widget
            chordEdit.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (chordEdit.get('visible') && event.key == 'Esc') {
        chordEdit.set('visible', false);
    }

});

module.exports = chordEdit;

},{"../models/chord_edit.js":22,"../views/chord_edit.js":39}],11:[function(require,module,exports){
var ChordTypes = require('../collections/chord_types.js');


var chord_types = new ChordTypes();

_.each(GLOBALS.chord_types, function(chord_type) {
    chord_types.add(chord_type);
});

module.exports = chord_types;

},{"../collections/chord_types.js":4}],12:[function(require,module,exports){
var help_button = $('.chord-chart .chart-edit-buttons .button.help');
var widget_el = $('.chord-chart .help-widget');

help_button.click(function() {
    widget_el.show();
});

$('html').click(function(event) {

    if (widget_el.is(':visible')) {

        var target = $(event.target);

        if (
            !target
                .closest('.help-widget')
                .closest('.chord-chart')
                .length &&
            !(
                target
                    .closest('.chart-edit-buttons')
                    .closest('.chord-chart')
                    .length &&
                target.hasClass('help')
            )
                
        ) {
            widget_el.hide();
        }

    }

});

$('html').on('keyup', function(event) {

    if (widget_el.is(':visible') && event.key == 'Esc') {
        widget_el.hide();
    }

});

},{}],13:[function(require,module,exports){
var LineEdit = require('../models/line_edit.js');
var LineEditView = require('../views/line_edit.js');
        

var lineEdit = new LineEdit();

new LineEditView({
    el: '.chord-chart .line-edit',
    model: lineEdit
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (lineEdit.get('visible')) {

        var target = $(event.target);

        // Check if the click wasn't a click to open the widget,
        // or a click inside the widget.
        if (
            !target
                .closest('.section-sidebar-part')
                .closest('.chord-chart')
                .length &&
            !target
                .closest('.line-edit')
                .closest('.chord-chart')
                .length
        ) {
            // close the widget
            lineEdit.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (lineEdit.get('visible') && event.key == 'Esc') {
        lineEdit.set('visible', false);
    }

});

module.exports = lineEdit;

},{"../models/line_edit.js":27,"../views/line_edit.js":43}],14:[function(require,module,exports){
var MeasureEdit = require('../models/measure_edit.js');
var MeasureEditView = require('../views/measure_edit.js');


var measureEdit = new MeasureEdit();

new MeasureEditView({
    el: '.chord-chart .measure-edit',
    model: measureEdit
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (measureEdit.get('visible')) {

        var target = $(event.target);

        if (
            // Check if the click wasn't a click to open the widget,
            // or a click inside the widget.
            (
                !target
                    .closest('.measure-edit')
                    .closest('.chord-chart')
                    .length &&
                !target
                    .closest('.measure')
                    .closest('.chord-chart')
                    .length
            ) ||
            // Or the click was on a chord (which is also inside
            // a measure).
            target
                .closest('.chord-name')
                .closest('.chord')
                .closest('.chord-chart')
                .length
        ) {
            // close the widget
            measureEdit.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (measureEdit.get('visible') && event.key == 'Esc') {
        measureEdit.set('visible', false);
    }

});

module.exports = measureEdit;

},{"../models/measure_edit.js":29,"../views/measure_edit.js":45}],15:[function(require,module,exports){
var SectionEdit = require('../models/section_edit.js');
var SectionEditView = require('../views/section_edit.js');


var sectionEdit = new SectionEdit();

new SectionEditView({
    el: '.chord-chart .section-edit',
    model: sectionEdit
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (sectionEdit.get('visible')) {

        var target = $(event.target);

        // Check if the click wasn't a click to open the widget,
        // or a click inside the widget.
        if (
            !(
                // click was to open the widget
                target
                    .closest('.section-header')
                    .closest('.chord-chart')
                    .length &&
                target.hasClass('name')
            ) &&
            // click was in the widget
            !target
                .closest('.section-edit')
                .closest('.chord-chart')
                .length
        ) {
            // close the widget
            sectionEdit.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (sectionEdit.get('visible') && event.key == 'Esc') {
        sectionEdit.set('visible', false);
    }

});

module.exports = sectionEdit;

},{"../models/section_edit.js":32,"../views/section_edit.js":48}],16:[function(require,module,exports){
var settings_el = $('.chord-chart .chart-edit-buttons .settings');
var widget_el = settings_el.find('.widget');

settings_el.find('.label').click(function() {
    widget_el.toggle();
});

widget_el.find('.sub-buttons .sub-button.delete').click(function() {

    if (confirm("Are you really sure you want to delete the chart?")) {
        $(this).find('form').submit();
    }

});

$('html').click(function(event) {

    if (widget_el.is(':visible')) {

        if (
            !$(event.target)
                .closest('.settings')
                .closest('.chart-edit-buttons')
                .closest('.chord-chart')
                .length
        ) {
            widget_el.hide();
        }

    }

});

$('html').on('keyup', function(event) {

    if (widget_el.is(':visible') && event.key == 'Esc') {
        widget_el.hide();
    }

});

},{}],17:[function(require,module,exports){
var SongNameChangeWidget = require('../models/song_name_change_widget.js');
var SongNameChangeWidgetView = require('../views/song_name_change_widget.js');


var songNameChangeWidget = new SongNameChangeWidget();

new SongNameChangeWidgetView({
    el: $('.chord-chart .chord-chart-header .song-name'),
    model: songNameChangeWidget
});

$('html').on('click', function(event) {

    if (songNameChangeWidget.get('visible')) {

        var target = $(event.target);

        if (
            !target
                .closest('.song-name-change')
                .closest('.song-name')
                .closest('.chord-chart')
                .length &&
            !target
                .closest('span')
                .closest('h1')
                .closest('.song-name')
                .closest('.chord-chart')
                .length
        ) {
            songNameChangeWidget.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (songNameChangeWidget.get('visible') && event.key == 'Esc') {
        songNameChangeWidget.set('visible', false);
    }

});

return songNameChangeWidget;

},{"../models/song_name_change_widget.js":35,"../views/song_name_change_widget.js":50}],18:[function(require,module,exports){
var TransposeWidget = require('../models/transpose_widget.js');
var TransposeWidgetView = require('../views/transpose_widget.js');


var transposeWidget = new TransposeWidget();

new TransposeWidgetView({
    el: $('.chord-chart .key-select'),
    model: transposeWidget
});

$('html').on('click', function(event) {

    // Close the widget if there was a click outside it.

    if (transposeWidget.get('visible')) {

        var target = $(event.target);

        // Check if the click wasn't a click to open the widget,
        // or a click inside the widget.
        if (
            !target
                .closest('.key-select')
                .closest('.chord-chart')
                .length &&
            !target
                .closest('.current-key')
                .closest('.open')
                .closest('.chord-chart')
                .length
        ) {
            transposeWidget.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (transposeWidget.get('visible') && event.key == 'Esc') {
        transposeWidget.set('visible', false);
    }

});

module.exports = transposeWidget;

},{"../models/transpose_widget.js":36,"../views/transpose_widget.js":51}],19:[function(require,module,exports){
var Sections = require('../collections/sections.js');


module.exports = Backbone.Model.extend({

    initialize: function() {

        // Only set sections if it hasn't been set yet. Prevents errors
        // when cloning.
        if (!(this.get('sections') instanceof Backbone.Collection)) {

            var that = this;
            var sections = new Sections();

            sections.url = (
                GLOBALS.api_root_url + 'charts/' +
                this.get('id') + '/sections'
            );

            _.each(this.get('sections'), function(section_data) {
                section_data.chart = that;
                sections.add(section_data);
            });

            this.set('sections', sections);

        }

    }

});

},{"../collections/sections.js":9}],20:[function(require,module,exports){
/*
 * Model specially for the API sync that transposes the chart.
 */
module.exports = Backbone.Model.extend({

    url: function() {

        return (
            GLOBALS.api_root_url +
            'chart-transpose/' +
            GLOBALS.chart_data.id + '/'
        );

    },

    isNew: function() {
        return true;
    },

    toJSON: function() {

        return {
            tonic: this.get('tonic')
        };

    }

});

},{}],21:[function(require,module,exports){
var chordTypes = require('../init/chord_types.js');
var allKeys = require('../../../core/widgets/all_keys.js');


module.exports = Backbone.Model.extend({

    initialize: function(attributes) {
        this.initData();
        this.initListeners();
    },

    initData: function() {

        if (!this.has('chord_type')) {
            this.initChordType();
        }

        if (!this.get('key')) {
            this.initKey();
        }

    },

    initListeners: function() {
        this.stopListening();
        this.listenTo(this, 'change', this.parseNextMeasure);
        this.listenTo(this, 'change:chord_type_id', this.initChordType);
        this.listenTo(this, 'change:key_id', this.initKey);
        this.listenTo(this, 'change:chord_pitch', this.initNote);
        this.listenTo(this, 'change:alt_bass_pitch', this.initAltBassNote);
    },

    /**
     * Initializes the chord type based on the current
     * `chord_type_id`.
     */
    initChordType: function() {
        this.set(
            'chord_type',
            chordTypes.get(this.get('chord_type_id'))
        );
    },

    /**
     * Initializes the `note` and `alt_bass_note` based on the
     * current key.
     */
    initKey: function() {
        this.set('key', allKeys.get(this.get('key_id')));
        this.initNote();
        this.initAltBassNote();
    },

    /**
     * Initializes the note in the current key
     */
    initNote: function() {
        this.set(
            'note',
            this.get('key').note(this.get('chord_pitch'))
        );
    },

    /**
     * Initializes the `alt_bass_note` in the current key based
     * on `alt_bass_pitch` if it is on (determined by
     * the `alt_bass` boolean), else sets it to `false`.
     */
    initAltBassNote: function() {

        var alt_bass_note;

        if (this.get('alt_bass')) {
            alt_bass_note = this.get('key').note(this.get('alt_bass_pitch'));
        } else {
            alt_bass_note = false;
        }

        this.set('alt_bass_note', alt_bass_note);

    },

    /**
     * Parses the next measure based on this measure
     *
     * If this and the next measure are on the same line and both
     * have beat_schema '4' then:
     * - If the chords are the same NOW, then next measure will
     *   display the repeat sign ( % ).
     * - If the chord before the change of this measure and the
     *   next chord were the same, then change the chord of the
     *   next measure to the chord of the current measure.
     */
    parseNextMeasure: function() {

        if (!GLOBALS.parsed) {
            // only parse next measure if whole chart has been done parsing
            return;
        }

        if (
            this.get('beats') == 4 &&
            this.get('measure').has('next_measure') &&
            this.get('measure').get('next_measure').get('beat_schema') == '4' &&
            this.get('measure').get('line') == this.get('measure').get('next_measure').get('line')
        ) {

            var next_chord = this.get('measure').get('next_measure')
                .get('chords').first();

            if (
                // Check if chords are the same NOW
                next_chord.get('chord_pitch') == this.get('chord_pitch') &&
                _.isEqual(
                    next_chord.get('chord_type').attributes,
                    this.get('chord_type').attributes
                ) &&
                (
                    (!next_chord.get('alt_bass') && !this.get('alt_bass')) ||
                    (
                        next_chord.get('alt_bass') && this.get('alt_bass') &&
                        next_chord.get('alt_bass_pitch') == this.get('alt_bass_pitch')
                    )
                )
            ) {

                // Trigger the `render()` by setting timestamp in
                // milliseconds in `changed` attribute. Then `render()`
                // will put the repeat sign ( % ) in.
                this.get('measure').get('next_measure').get('chords').first()
                    .set('changed', new Date().getTime());

            } else {

                var prev_attr = this.previousAttributes();

                if (
                    // Check if the current measure's chord before the change
                    // is the same as the next measure's chord
                    _.isEqual(
                        next_chord.get('chord_pitch'),
                        prev_attr.chord_pitch
                    ) && _.isEqual(
                        next_chord.get('chord_type').attributes,
                        prev_attr.chord_type.attributes
                    ) && (
                        (
                            !next_chord.get('alt_bass') &&
                            !prev_attr.alt_bass
                        ) || (
                            next_chord.get('alt_bass') &&
                            prev_attr.alt_bass &&
                            _.isEqual(
                                next_chord.get('alt_bass_pitch'),
                                prev_attr.alt_bass_pitch
                            )
                        )
                    )
                ) {

                    next_chord.set({
                        'chord_pitch': this.get('chord_pitch'),
                        'chord_type': this.get('chord_type'),
                        'alt_bass': this.get('alt_bass'),
                        'alt_bass_pitch': this.get('alt_bass_pitch')
                    });

                    next_chord.save();

                }

            }

        }

    },

    /**
     * Returns the full chord name
     */
    chordName: function() {

        var bass_note;

        if (this.get('alt_bass')) {
            bass_note = '/' + this.get('alt_bass_note').get('name');
        } else {
            bass_note = '';
        }

        return (
            this.get('note').get('name') +
            this.get('chord_type').get('chord_output') +
            bass_note
        );

    },

    /**
     * Returns the string that should be outputted on the chart. This
     * is usually the chordName but in some cases the repeat sign ( % )
     */
    chartOutput: function() {

        if (this.get('rest')) {
            return 'REST';
        }

        // If this chord and the previous chord's measure_schema are both '4'
        // and are on the same line and had the same chord, use the repeat
        // sign ( % ). Otherwise use the chordName.

        if (
            this.get('beats') == 4 &&
            this.get('measure').has('prev_measure') &&
            this.get('measure').get('line') == this.get('measure')
                .get('prev_measure').get('line') &&
            this.get('measure').get('prev_measure')
                .get('beat_schema') == '4' &&
            this.get('measure').get('prev_measure').get('chords')
            .first().chordName() == this.chordName()
        ) {
            return '%';
        } else {
            return this.chordName();
        }

    },

    copy: function(attributes) {

        var copy = this.clone();
        copy.set({
            id: null
        });

        if (attributes) {
            copy.set(attributes);
        }

        copy.initListeners();

        return copy;

    },

    toJSON: function() {

        return {
            beats: this.get('beats'),
            chord_pitch: this.get('chord_pitch'),
            chord_type_id: this.get('chord_type').get('id'),
            alt_bass: this.get('alt_bass'),
            alt_bass_pitch: this.get('alt_bass_pitch'),
            rest: this.get('rest'),
            number: this.get('number')
        };

    }

});

},{"../../../core/widgets/all_keys.js":52,"../init/chord_types.js":11}],22:[function(require,module,exports){
module.exports = Backbone.Model.extend();

},{}],23:[function(require,module,exports){
var ChordType = require('./chord_type.js');


module.exports = Backbone.Model.extend({
    initialize: function() {
        this.set('chord_type', new ChordType(this.get('chord_type')));
    }
});

},{"./chord_type.js":25}],24:[function(require,module,exports){
module.exports=require(22)
},{}],25:[function(require,module,exports){
module.exports=require(22)
},{}],26:[function(require,module,exports){
var Measures = require('../collections/measures.js');


module.exports = Backbone.Model.extend({

    initialize: function() {

        // Only set measures if it hasn't been set yet. Prevents errors
        // when cloning.
        if (!(this.get('measures') instanceof Backbone.Collection)) {

            var that = this;
            var measures = new Measures();
            measures.url = this.measuresUrl();

            _.each(this.get('measures'), function(measure_data) {
                measure_data.line = that;
                measures.add(measure_data);
            });

            measures.initPrevNextMeasures();

            this.set('measures', measures);

        }

        this.initListeners();

    },

    measuresUrl: function() {
        return this.url() + '/measures';
    },

    initListeners: function() {
        this.stopListening();
        this.listenTo(this.get('measures'), 'remove', this.measureRemoved);
    },

    previous: function() {
        return this.getSibling(-1);
    },

    next: function() {
        return this.getSibling(1);
    },

    /**
     * Returns the sibling line in the collection that is
     * `difference` away from this line, where a negative
     * `difference` will return a previous sibling and a
     * positive `difference` an upcoming sibling.
     */
    getSibling: function(difference) {

        return this.collection.findWhere({
            number: this.get('number') + difference
        });

    },

    measureRemoved: function() {

        if (!this.get('measures').length) {
            this.destroy();
        }

    },

    copy: function(attributes) {

        var copy = this.clone();
        copy.set({
            id: null,
            measures: this.get('measures').copy({ line: copy })
        });

        if (attributes) {
            copy.set(attributes);
        }

        copy.initListeners();

        return copy;

    },

    /**
     * Recursively saves this line and it's children (measures
     * and chords).
     */
    saveRecursive: function() {

        var that = this;

        this.save(null, { success: function() {
            that.get('measures').url = that.measuresUrl();
            that.get('measures').each(function(measure) {
                measure.saveRecursive();
            });
        }});

    },

    toJSON: function() {
        return {
            number: this.get('number'),
            letter: this.get('letter'),
            merge_with_next_line: this.get('merge_with_next_line')
        };
    }

});

},{"../collections/measures.js":8}],27:[function(require,module,exports){
module.exports=require(22)
},{}],28:[function(require,module,exports){
var Chords = require('../collections/chords.js');


module.exports = Backbone.Model.extend({

    initialize: function() {
        this.initData();
        this.initListeners();
    },

    initData: function() {

        // Only set chords if it hasn't been set yet. Prevents errors
        // when cloning.
        if (!(this.get('chords') instanceof Backbone.Collection)) {

            var that = this;
            var chords = new Chords();
            chords.url = this.chordsUrl();

            _.each(this.get('chords'), function(chord_data) {
                chord_data.measure = that;
                chords.push(chord_data);
            });

            this.set('chords', chords);

        }

    },

    chordsUrl: function() {
        return this.url() + '/chords';
    },

    initListeners: function() {
        this.stopListening();
        this.listenTo(this, 'change', this.change);
    },

    change: function() {

        if (this.hasChanged('beat_schema')) {
            this.updateBeatSchema();
            this.renderNextMeasure();
        }

        // If the number of this measure changed, then set the number
        // of the next measure to this one + 1 (which will go on as
        // long as there's a next measure).
        if (this.hasChanged('number')) {

            if (this.has('next_measure')) {
                this.get('next_measure').set(
                    'number', this.get('number') + 1
                );
            }

        }

    },

    updateBeatSchema: function() {
        // Changes the beatschema to given value and reset's the chords
        // according to the current beat_schema.
        //
        // It will set the chords' correct beats and will remove
        // overflowing chords or add missing chords.

        var that = this;
        var beats_set = this.get('beat_schema').split('-');
        var last_chord;
        var new_chord = false;
        var new_chords = [];
        var new_chord_views = [];

        _.each(beats_set, function(beats, index) {

            var chord = that.get('chords').at(index);

            if (!chord) {
                chord = last_chord.copy();
                new_chord = true;
            } else {
                new_chord = false;
            }

            chord.set({
                beats: parseInt(beats),
                number: index + 1
            });

            if (new_chord) {
                new_chords.push(chord);
            }

            last_chord = chord;

        });

        if (new_chords.length) {
            this.get('chords').add(new_chords);
        }

    },

    renderNextMeasure: function() {

        if (
            this.has('next_measure') &&
            this.get('next_measure').get('beat_schema') == "4"
        ) {
            // Trigger the `render()` by setting timestamp in
            // milliseconds in `changed` attribute. Then `render()`
            // will show or remove the repeat sign ( % ).
            this.get('next_measure').get('chords').first()
                .set('changed', new Date().getTime());
        }

    },

    remove: function() {

        var prev_measure = this.get('prev_measure');
        var next_measure = this.get('next_measure');

        if (prev_measure) {

            if (next_measure) {
                next_measure.set({
                    'prev_measure': prev_measure,
                    'number': this.get('number')
                });
                prev_measure.set('next_measure', next_measure);
            } else {
                prev_measure.unset('next_measure');
            }

        } else if (next_measure) {
            next_measure.unset('prev_measure');
        }

        this.destroy();

    },

    copy: function(attributes) {

        var copy = this.clone();
        copy.set({
            id: null,
            chords: this.get('chords').copy({ measure: copy })
        });

        if (attributes) {
            copy.set(attributes);
        }

        copy.initListeners();

        return copy;

    },

    /**
     * Recursively saves this measure and it's children (chords).
     */
    saveRecursive: function() {

        var that = this;

        this.save(null, { success: function() {
            that.get('chords').url = that.chordsUrl();
            that.get('chords').each(function(chord) {
                chord.save();
            });
        }});

    },

    toJSON: function() {
        return {
            number: this.get('number'),
            beat_schema: this.get('beat_schema')
        };
    }

});

},{"../collections/chords.js":5}],29:[function(require,module,exports){
module.exports=require(22)
},{}],30:[function(require,module,exports){
module.exports=require(22)
},{}],31:[function(require,module,exports){
var Lines = require('../collections/lines.js');
var allKeys = require('../../../core/widgets/all_keys.js');


module.exports = Backbone.Model.extend({

    initialize: function() {
        this.initData();
        this.initListeners();
    },

    initData: function() {

        // Only set lines if it hasn't been set yet. Prevents errors
        // when cloning.
        if (!(this.get('lines') instanceof Backbone.Collection)) {

            var that = this;
            var lines = new Lines();
            lines.url = this.linesUrl();

            _.each(this.get('lines'), function(line_data) {
                line_data.section = that;
                lines.add(line_data);
            });

            this.set('lines', lines);

        }

        if (!(this.get('key') instanceof Backbone.Model)) {

            this.set(
                'key',
                allKeys.findWhere({
                    id: this.get('key_id')
                })
            );

        }

    },

    linesUrl: function() {
        return this.url() + '/lines';
    },

    initListeners: function() {
        this.stopListening();
    },

    /**
     * Returns the on-screen height of this section.
     */
    height: function() {
        return (
            this.get('lines').length *
            (
                GLOBALS.settings.box_height +
                GLOBALS.settings.border_width
            )
        ) + GLOBALS.settings.border_width;
    },

    copy: function(attributes) {

        var copy = this.clone();
        copy.set({
            id: null,
            lines: this.get('lines').copy({ section: copy })
        });

        if (attributes) {
            copy.set(attributes);
        }

        copy.initListeners();

        return copy;

    },

    /**
     * Recursively saves this section and it's children (lines,
     * measures and chords).
     */
    saveRecursive: function() {

        var that = this;

        this.save(null, { success: function() {
            that.get('lines').url = that.linesUrl();
            that.get('lines').each(function(line) {
                line.saveRecursive();
            });
        }});

    },

    toJSON: function() {
        return {
            number: this.get('number'),
            key_id: this.get('key').get('id'),
            title: this.get('title'),
            time_signature: this.get('time_signature'),
            show_sidebar: this.get('show_sidebar')
        };
    }

});

},{"../../../core/widgets/all_keys.js":52,"../collections/lines.js":6}],32:[function(require,module,exports){
module.exports=require(22)
},{}],33:[function(require,module,exports){
/*
 * Model specially for the API sync that updates the section's
 * key without changing the chords.
 */
module.exports = Backbone.Model.extend({

    url: function() {

        return (
            GLOBALS.api_root_url +
            'section-key/' +
            this.get('section').get('id') + '/'
        );

    },

    isNew: function() {
        return true;
    },

    toJSON: function() {

        var key = this.get('section').get('key');

        return {
            tonic: key.get('tonic'),
            tonality: key.get('tonality')
        };

    }

});

},{}],34:[function(require,module,exports){
module.exports=require(22)
},{}],35:[function(require,module,exports){
module.exports = Backbone.Model.extend({

    defaults: {
        visible: false
    },

    url: (
        GLOBALS.api_root_url +
        'chart-song-name/' +
        GLOBALS.chart_data.id + '/'
    ),

    isNew: function() {
        return true;
    },

    toJSON: function() {

        return {
            song_name: this.get('song_name'),
        };

    }

});

},{}],36:[function(require,module,exports){
module.exports = Backbone.Model.extend({
    defaults: {
        visible: false
    }
});

},{}],37:[function(require,module,exports){
var Lines = require('../collections/lines.js');
var Measures = require('../collections/measures.js');
var Chart = require('../models/chart.js');
var SectionView = require('./section.js');


module.exports = Backbone.View.extend({

    className: 'chart',

    events: {
        'click .section-new': 'createNewSection',
    },

    createNewSection: function() {

        var last_section = this.model.get('sections').last();

        var new_section = last_section.copy({
            number: last_section.get('number') + 1,
            alt_name: '',
        });

        var new_line = new_section.get('lines').first().copy();
        var new_measure = new_line.get('measures').first().copy({
            next_measure: null,
            prev_measure: null
        });

        new_line.get('measures').reset([new_measure]);
        new_section.get('lines').reset([new_line]);

        var sections = this.model.get('sections');
        sections.add(new_section);

        if (sections.size() == 2) {
            // If this is the second section, it means the first
            // section should now get move and remove buttons.
            // So we trigger a 'change' event so that it will
            // rerender itself.
            sections.first().trigger('change');
        }

        var sectionView = new SectionView({
            model: new_section
        });

        sectionView.render().$el.insertBefore(
            this.$el.find('.section-new')
        );

        new_section.saveRecursive();

    }

});

},{"../collections/lines.js":6,"../collections/measures.js":8,"../models/chart.js":19,"./section.js":47}],38:[function(require,module,exports){
var Chord = require('../models/chord.js');
var chordEdit = require('../init/chord_edit.js');


module.exports = Backbone.View.extend({

    model: Chord,
    className: 'chord',

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click .chord-name': 'openChordEdit'
    },

    /**
     * Opens the edit widget for this chord
     */
    openChordEdit: function() {

        if (!GLOBALS.edit) {
            return;
        }

        // If the chord edit widget is already open for this chord then
        // close it, otherwise open it.
        if (
            chordEdit.get('visible') &&
            chordEdit.get('chord') == this.model
        ) {
            chordEdit.set('visible', false);
        } else {
            chordEdit.set({
                visible: true,
                chord: this.model,
                offset: this.$el.offset()
            });
        }

    },

    render: function() {

        if (!this.model.get('measure')) {
            // only parse next measure if whole chart has been done parsing
            return;
        }

        this.$el.addClass('chord-' + this.model.get('number'));

        var font_size;

        if (this.model.get('rest')) {
            font_size = 'tiny';
        } else {
            font_size = 'normal';
        }

        this.$el.html(
            '<span class="chord-name font-size-' + font_size + '">' + 
                this.model.chartOutput() +
            '</span>'
        );

        return this;

    },

});

},{"../init/chord_edit.js":10,"../models/chord.js":21}],39:[function(require,module,exports){
var ChordEditNotes = require('../collections/chord_edit_notes.js');
var ChordEditChordTypes = require('../collections/chord_edit_chord_types.js');
var ChordEdit = require('../models/chord_edit.js');
var ChordEditNote = require('../models/chord_edit_note.js');
var chordTypes = require('../init/chord_types.js');
var allKeys = require('../../../core/widgets/all_keys.js');
var ChordEditNoteView = require('./chord_edit_note.js');
var ChordEditChordTypeView = require('./chord_edit_chord_type.js');


module.exports = Backbone.View.extend({

    model: ChordEdit,

    events: {
        'click header .close': 'close',
        'click .tabs li': 'switchTab',
        'click .chord-settings .setting.note .rest': 'useAsRest',
        'click .chord-settings .setting.type .toggle': 'toggleChordTypes',
        'click .chord-settings .setting.alt-bass-note .none': 'noAltBass'
    },

    initialize: function() {
        this.chord_type_el = this.$el.find('.chord-settings .setting.type');
        this.initChordTypes();
        this.listenTo(this.model, 'change', this.render);
    },

    render: function() {

        // Only show the edit widget when 'visible' is true,
        // otherwise, hide the edit widget.

        if (this.model.get('visible')) {

            var previousAttributes = this.model.previousAttributes();

            // If the edit widget was already open for this chord,
            // then apparently something else than the visibility
            // changed, so we apply the changes.
            if (
                previousAttributes.visible &&
                this.model.get('chord') == previousAttributes.chord
            ) {
                this.applyChanges();
            }

            this.show();

        } else {
            this.$el.hide();
        }

        return this;

    },

    initChordTypes: function() {
        // Creates the views for the chord type choices and binds them to
        // the existing HTML

        var that = this;
        this.chordEditChordTypes = new ChordEditChordTypes();

        chordTypes.each(function(chord_type) {
            that.chordEditChordTypes.add({
                chord_type: chord_type
            });
        });

        var number = 0;
        var chordEditChordType;

        this.chord_type_el.find('li').each(function() {

            chordEditChordType = that.chordEditChordTypes.models[number];
            chordEditChordType.set('editWidget', that.model);

            new ChordEditChordTypeView({
                el: this,
                model: chordEditChordType
            });

            number++;

        });

    },

    applyChanges: function() {
        // Applies the changes made in the edit widget to the chord

        var note = Boolean(this.model.get('note'));
        var alt_bass = Boolean(this.model.get('alt_bass_note'));

        var chord_data = {
            chord_type_id: this.model.get('chord_type').get('id'),
            alt_bass: alt_bass,
            rest: !note
        };

        if (note) {
            chord_data.chord_pitch = this.model.get('note').get(
                'distance_from_root'
            );
        }

        if (alt_bass) {
            chord_data.alt_bass_note = this.model.get('alt_bass_note');
            chord_data.alt_bass_pitch = (
                this.model.get('alt_bass_note').get('distance_from_root')
            );
        } else {
            chord_data.alt_bass_note = false;
        }

        this.model.get('chord').set(chord_data);
        this.model.get('chord').save();

    },

    close: function() {
        this.model.set('visible', false);
    },

    switchTab: function(obj) {
        // Switches to a tab in the edit widget
        // like 'note', 'type' and 'alt_bass_bass'

        var tab = $(obj.currentTarget);
        this.openTab(tab.data('key'));

    },

    openTab: function(key) {
        // Opens tab matching provided key

        this.$el.find('.tabs li').removeClass('active')
            .parent().find('li[data-key=' + key + ']')
            .addClass('active');

        this.$el.find('.chord-settings .setting').hide().parent().find(
            '.setting[data-key=' + key + ']'
        ).show();

    },

    /**
     * Sets this chord to be used as a rest.
     */
    useAsRest: function() {
        this.model.set('note', false);
    },

    /**
     * Toggles between the two pages of chord type options
     */
    toggleChordTypes: function(obj) {

        if (this.chord_type_el.find('.type-part-1').is(':visible')) {
            this.showChordTypePart(2);
        } else {
            this.showChordTypePart(1);
        }

    },

    noAltBass: function() {
        this.model.set('alt_bass_note', false);
    },

    showChordTypePart: function(number) {
        // Shows the chord type part of the provided number
        // The chord type choices are in these parts
        this.chord_type_el.find('.type-part').hide();
        this.chord_type_el.find('.type-part-' + number).show();
    },

    /**
     * Parses the settings on the model and render the html
     * accordingly.
     */
    show: function() {

        // If the edit widget opens on a different chord than the
        // last one, then reset the editWidget.
        if (
            this.model.previousAttributes().chord !=
            this.model.get('chord')
        ) {
            this.reset();
        }

        var offset = this.offset();

        this.$el.css({
            'top': this.model.get('offset').top + offset.top,
            'left': this.model.get('offset').left + offset.left
        });

        this.parseNotes();
        this.parseChordTypes();

        this.$el.show();

    },

    offset: function() {
        // Get the offset for the edit widget based on the chord it was
        // opened for.

        var beat_schema = this.model.get('chord')
            .get('measure').get('beat_schema');

        var off_top;
        var off_left;

        switch(beat_schema) {

            case '4':
                off_top = 85;
                off_left = -10;
                break;

            case '2-2':
                off_top = 60;
                off_left = -29;
                break;

            case '2-1-1':

                switch(this.model.get('chord').get('number')) {

                    case 1:
                        off_top = 60;
                        off_left = -29;
                        break;

                    case 2:
                        off_top = 47;
                        off_left = -9;
                        break;

                    case 3:
                        off_top = 77;
                        off_left = -39;
                        break;

                }

                break;

            case '1-1-2':

                switch(this.model.get('chord').get('number')) {

                    case 1:
                        off_top = 77;
                        off_left = -39;
                        break;

                    case 2:
                        off_top = 47;
                        off_left = -9;
                        break;

                    case 3:
                        off_top = 60;
                        off_left = -29;
                        break;

                }

                break;

            case '1-1-1-1':

                switch(this.model.get('chord').get('number')) {

                    case 1:
                        off_top = 77;
                        off_left = -39;
                        break;

                    case 2:
                        off_top = 47;
                        off_left = -9;
                        break;

                    case 3:
                        off_top = 47;
                        off_left = -9;
                        break;

                    case 4:
                        off_top = 77;
                        off_left = -39;
                        break;

                }

                break;

        }

        return {
            top: off_top,
            left: off_left
        };

    },

    /**
     * Parses the note and the alt bass note choices.
     */
    parseNotes: function() {

        var that = this;
        var note_types = ['note', 'alt_bass_note'];

        // If the notes are different from the last time, regenerate
        // the models/views.
        if (
            this.model.get('note_choices') !=
            this.model.previousAttributes().note_choices
        ) {

            that.editWidgetNotes = [];

            _.each(note_types, function(note_type) {

                that.editWidgetNotes[note_type] = new ChordEditNotes();
                var editWidgetNote;
                var note_choices = that.$el.find(
                    '.chord-settings ' +
                    '.setting[data-key=' + note_type + '] ul'
                );
                note_choices.html('');

                that.model.get('note_choices').each(function(note) {

                    editWidgetNote = new ChordEditNote({
                        note_id: note.get('id'), // used for `findWhere` later on
                        note: note,
                        note_type: note_type,
                        editWidget: that.model
                    });

                    that.editWidgetNotes[note_type].add(editWidgetNote);

                    note_choices.append(
                        new ChordEditNoteView({
                            model: editWidgetNote
                        }).render().el
                    );

                });

            });

        }

        // Select the correct note
        _.each(note_types, function(note_type) {

            // Deselect last selected if it exists
            var current_selected = (
                that.editWidgetNotes[note_type]
                .findWhere({ selected: true })
            );

            if (current_selected) {
                current_selected.set('selected', false);
            }

            // Select note if it is set (bass note doesn't have to be
            // set)

            var deselect_button = that.$el.find(
                '.chord-settings ' +
                '.setting[data-key=' + note_type + '] .deselect'
            );

            if (that.model.get(note_type)) {

                if (deselect_button) {
                    deselect_button.removeClass('selected');
                }

                that.editWidgetNotes[note_type].findWhere({
                    note_id: that.model.get(note_type).id
                }).set('selected', true);

            } else if (deselect_button) {
                deselect_button.addClass('selected');
            }

        });

    },

    parseChordTypes: function() {
        // Select the correct chord type

        var that = this;
        var current_selected = this.chordEditChordTypes.findWhere({
            selected: true
        });

        if (current_selected) {
            current_selected.set('selected', false);
        }

        this.chordEditChordTypes.find(function(chordEditChordType) {
            return (
                chordEditChordType.get('chord_type').get('id') ==
                that.model.get('chord_type').get('id')
            );
        }).set('selected', true);

    },

    /**
     * Resets the edit widget to the "start state".
     *
     * For example, the chosen chord is the chord the edit is on and
     * the selected tab is the note tab.
     */
    reset: function() {

        var chord = this.model.get('chord');
        var rest = chord.get('rest');
        var note;

        if (rest) {
            note = false;
        } else {
            note = chord.get('note');
        }

        this.model.set({
            note: note,
            chord_type: chord.get('chord_type'),
            alt_bass: chord.get('alt_bass'),
            alt_bass_note: chord.get('alt_bass_note'),
            rest: rest,
            note_choices: (
                allKeys.findWhere({
                    id: chord.get('key_id')
                }).get('notes')
            )
        });

        // Show the chord type part that has the curent selected chord
        // type.
        var current_chord_type = this.chordEditChordTypes.findWhere({
            chord_type: this.model.get('chord_type')
        });

        if (this.chordEditChordTypes.indexOf(current_chord_type) > 11) {
            this.showChordTypePart(2);
        } else {
            this.showChordTypePart(1);
        }

        this.openTab('note');

    }

});

},{"../../../core/widgets/all_keys.js":52,"../collections/chord_edit_chord_types.js":2,"../collections/chord_edit_notes.js":3,"../init/chord_types.js":11,"../models/chord_edit.js":22,"../models/chord_edit_note.js":24,"./chord_edit_chord_type.js":40,"./chord_edit_note.js":41}],40:[function(require,module,exports){
var ChordEditChordType = require('../models/chord_edit_chord_type.js');


module.exports = Backbone.View.extend({

    model: ChordEditChordType,

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click': 'chooseSymbol'
    },

    chooseSymbol: function() {
        this.model.get('editWidget').set(
            'chord_type',
            this.model.get('chord_type')
        );
    },

    render: function() {

        this.$el.html(this.model.get('symbol'));

        if (this.model.get('selected')) {
            this.$el.addClass('selected');
        } else {
            this.$el.removeClass('selected');
        }

    }

});

},{"../models/chord_edit_chord_type.js":23}],41:[function(require,module,exports){
var ChordEditNote = require('../models/chord_edit_note.js');


module.exports = Backbone.View.extend({

    tagName: 'li',
    model: ChordEditNote,

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click': 'chooseNote'
    },

    chooseNote: function() {
        // Sets the chosen note on the editWidget
        this.model.get('editWidget').set(
            this.model.get('note_type'),
            this.model.get('note')
        );
        return this;
    },

    render: function() {

        this.$el.html(this.model.get('note').get('name'));

        if (this.model.get('selected')) {
            this.$el.addClass('selected');
        } else {
            this.$el.removeClass('selected');
        }

        return this;

    }

});

},{"../models/chord_edit_note.js":24}],42:[function(require,module,exports){
var MeasureView = require('./measure.js');


module.exports = Backbone.View.extend({

    tagName: 'tr',
    className: 'line',

    initialize: function() {
        this.listenTo(this.model.get('measures'), 'add', this.measureAdded);
        this.listenTo(this.model.get('measures'), 'remove', this.measureRemoved);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    events: {
        'click .measure-add .plus': 'addMeasure'
    },

    measureAdded: function() {

        if (this.model.get('measures').length < 8) {
            this.$el.find('.colspan').prop(
                'colspan',
                8 - this.model.get('measures').length
            );
        } else {
            this.$el.find('.measure-add').remove();
        }

    },

    measureRemoved: function() {

        if (this.model.get('measures').length == 7) {
            this.addMeasureAddWidget(1);
        } else {
            this.$el.find('.colspan').prop(
                'colspan',
                8 - this.model.get('measures').length
            );
        }

    },

    addMeasureAddWidget: function(colspan) {
        this.$el.append(
            '<td class="measure-add colspan" colspan="' + colspan + '">' +
                '<div class="plus">' +
                    '<span class="fa fa-plus"></span>' +
                '</div>' +
            '</td>'
        );
    },

    addMeasure: function() {

        var last_measure = this.model.get('measures').last();
        var new_measure = last_measure.copy({
            prev_measure: last_measure,
            number: last_measure.get('number') + 1
        });

        last_measure.set('next_measure', new_measure);
        this.model.get('measures').add(new_measure);

        var measureView = new MeasureView({
            model: new_measure
        });

        var measureViewEl = measureView.render().$el;

        if (this.$el.find('.measure-add').length) {
            measureViewEl.insertBefore(
                this.$el.find('.measure-add')
            );
        } else {
            this.$el.append(measureViewEl);
        }

        new_measure.saveRecursive();

    },

    render: function() {

        var measureViews = [];
        var measureView;

        this.model.get('measures').each(function(measure) {

            measureView = new MeasureView({
                model: measure
            });

            measureViews.push(measureView.render().el);

        });

        this.$el.append(measureViews);

        var measureVoid = 8 - this.model.get('measures').length;

        if (measureVoid) {
            this.addMeasureAddWidget(measureVoid);
        }

        return this;

    }

});

},{"./measure.js":44}],43:[function(require,module,exports){
module.exports = Backbone.View.extend({

    tagName: 'div',
    className: 'line-edit',

    initialize: function() {
        this.initListeners();
    },

    initListeners: function() {
        this.stopListening();
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click .letters li': 'chooseLetter',
        'change input[name=merge-up]': 'mergeUp',
        'change input[name=merge-down]': 'mergeDown',
        'click .disable-sidebar': 'disableSidebar',
        'click .header .close': 'hide'
    },

    render: function() {

        // Only show the edit widget when 'visible' is true,
        // otherwise, hide the edit widget.

        if (this.model.get('visible')) {
            this.show();
        } else {
            this.hide();
        }

        return this;

    },

    show: function() {

        var offset = this.offset();

        this.$el.css({
            top: offset.top,
            left: offset.left
        });

        this.parseLetters();
        this.parseMergeOption();

        this.$el.show();

    },

    parseLetters: function() {

        this.$el.find('.letters li').removeClass('selected');

        this.$el.find(
            '.letters li[' +
                'data-letter=' +
                this.model.get('line').get('letter') +
            ']'
        ).addClass('selected');

    },

    parseMergeOption: function() {

        var this_line = this.model.get('line');
        var prev_line = this.model.get('line').previous();
        var next_line = this.model.get('line').next();

        var merge_up_el = this.$el.find('.merge-up');
        var merge_down_el = this.$el.find('.merge-down');

        if (
            prev_line &&
            prev_line.get('letter') == this_line.get('letter')
        ) {

            if (prev_line.get('merge_with_next_line')) {
                merge_up_el.find('input').prop('checked', true);
            } else {
                merge_up_el.find('input').prop('checked', false);
            }

            merge_up_el.show();

        } else {
            merge_up_el.hide();
        }

        if (
            next_line &&
            next_line.get('letter') == this_line.get('letter')
        ) {

            if (this_line.get('merge_with_next_line')) {
                merge_down_el.find('input').prop('checked', true);
            } else {
                merge_down_el.find('input').prop('checked', false);
            }

            merge_down_el.show();

        } else {
            merge_down_el.hide();
        }

    },

    /**
     * Returns the offset of the widget.
     */
    offset: function() {

        var offset = {
            top: this.model.get('offset').top,
            left: this.model.get('offset').left
        };

        offset.top += GLOBALS.settings.box_height / 2 + 30;
        offset.left += GLOBALS.settings.section_sidebar_width / 2 - 30;

        return offset;

    },

    hide: function() {

        var onClose = this.model.get('onClose');

        if (onClose) {
            // Call `onClose()` callback function if it is
            // defined.
            onClose();
        }

        this.$el.hide();

    },

    chooseLetter: function(event) {

        var letter = event.target.getAttribute('data-letter');
        var line = this.model.get('line');

        line.set('letter', letter);
        line.save();

        this.render();
        this.model.get('section_sidebar').trigger('change');

    },

    mergeUp: function(event) {

        var prev_line = this.model.get('line').previous();

        prev_line.set(
            'merge_with_next_line',
            $(event.target).is(':checked')
        );

        prev_line.save();

    },

    mergeDown: function(event) {

        var line = this.model.get('line');

        line.set(
            'merge_with_next_line',
            $(event.target).is(':checked')
        );

        line.save();

    },

    disableSidebar: function() {

        var section = this.model.get('section');
        section.set('show_sidebar', false);
        section.save();

        this.hide();

    }

});

},{}],44:[function(require,module,exports){
var Measure = require('../models/measure.js');
var measureEdit = require('../init/measure_edit.js');
var MeasureWidget = require('../../../core/widgets/measure.js');
var ChordView = require('./chord.js');


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

},{"../../../core/widgets/measure.js":54,"../init/measure_edit.js":14,"../models/measure.js":28,"./chord.js":38}],45:[function(require,module,exports){
var MeasureEditMeasures = require('../collections/measure_edit_measures.js');
var MeasureEdit = require('../models/measure_edit.js');
var MeasureEditMeasure = require('../models/measure_edit_measure.js');
var MeasureEditMeasureView = require('./measure_edit_measure.js');


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

},{"../collections/measure_edit_measures.js":7,"../models/measure_edit.js":29,"../models/measure_edit_measure.js":30,"./measure_edit_measure.js":46}],46:[function(require,module,exports){
var MeasureEditMeasure = require('../models/measure_edit_measure.js');


module.exports = Backbone.View.extend({

    model: MeasureEditMeasure,
    tagName: 'li',

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click': 'chooseBeatSchema'
    },

    chooseBeatSchema: function() {

        this.model.get('measureEdit').set(
            'beat_schema',
            this.model.get('beat_schema')
        );

    },

    render: function() {

        if (!this.measures_drawn) {
            this.drawMeasures();
            this.measures_drawn = true;
        }

        if (this.model.get('selected')) {
            this.$el.find('.measure').addClass('selected');
        } else {
            this.$el.find('.measure').removeClass('selected');
        }

        return this;

    },

    drawMeasures: function() {

        var template = _.template(
            $('#template-measure-edit-measure').html()
        );

        var num_chords;

        switch(this.model.get('beat_schema')) {

            case '4':
                num_chords = 1;
                break;

            case '2-2':
                num_chords = 2;
                break;

            case '2-1-1':
            case '1-1-2':
                num_chords = 3;
                break;

            case '1-1-1-1':
                num_chords = 4;
                break;

        }

        this.$el.html(
            template({
                beat_schema: this.model.get('beat_schema'),
                num_chords: num_chords
            })
        );

        this.drawSeperationLines();

    },

    drawSeperationLines: function() {

        var element = this.$el.find('.measure');
        var canvas;
        var context;

        switch(this.model.get('beat_schema')) {

            case '2-2':

                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');

                canvas.style.position = 'absolute';
                canvas.width = 50;
                canvas.height = 50;

                context.lineWidth = 1;

                context.beginPath();
                context.moveTo(50, 0);
                context.lineTo(0, 50);
                context.stroke();

                element.prepend(canvas);

                break;

            case '2-1-1':

                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');

                canvas.style.position = 'absolute';
                canvas.width = 50;
                canvas.height = 50;

                context.lineWidth = 1;

                context.beginPath();
                context.moveTo(50, 0);
                context.lineTo(0, 50);
                context.stroke();

                context.beginPath();
                context.moveTo(25, 25);
                context.lineTo(50, 50);
                context.stroke();

                element.prepend(canvas);

                break;

            case '1-1-2':

                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');

                canvas.style.position = 'absolute';
                canvas.width = 50;
                canvas.height = 50;

                context.lineWidth = 1;

                context.beginPath();
                context.moveTo(50, 0);
                context.lineTo(0, 50);
                context.stroke();

                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(25, 25);
                context.stroke();

                element.prepend(canvas);

                break;

            case '1-1-1-1':

                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');

                canvas.style.position = 'absolute';
                canvas.width = 50;
                canvas.height = 50;

                context.lineWidth = 1;

                context.beginPath();
                context.moveTo(50, 0);
                context.lineTo(0, 50);
                context.stroke();

                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(50, 50);
                context.stroke();

                element.prepend(canvas);

                break;

        }

    }

});

},{"../models/measure_edit_measure.js":30}],47:[function(require,module,exports){
var Line = require('../models/line.js');
var SectionSidebar = require('../models/section_sidebar.js');
var sectionEdit = require('../init/section_edit.js');
var SectionSidebarView = require('./section_sidebar.js');
var LineView = require('./line.js');


module.exports = Backbone.View.extend({

    tagName: 'section',
    className: 'section',

    initialize: function() {
        this.initListeners();
    },

    events: {
        'click .section-header .name': 'toggleSectionEdit',
        'click .section-header .section-edit-buttons .move-up': 'moveUp',
        'click .section-header .section-edit-buttons .move-down': 'moveDown',
        'click .section-header .section-edit-buttons .remove': 'removeSection',
        'click .line-add .plus': 'addLine',
    },

    initListeners: function() {
        this.stopListening();
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model.get('lines'), 'remove', this.renderSidebar);
    },

    toggleSectionEdit: function(event) {

        if (!GLOBALS.edit) {
            return;
        }

        if (sectionEdit.get('visible')) {
            sectionEdit.set('visible', false);
        } else {
            sectionEdit.set({
                visible: true,
                section: this.model,
                offset: $(event.target).offset()
            });
        }

    },

    render: function() {

        var template = _.template(
            $('#template-section').html()
        );

        this.$el.html(template());

        this.renderHeader();
        this.renderSidebar();
        this.renderLines();

        return this;

    },

    renderHeader: function() {

        var template = _.template($('#template-section-header').html());
        var title = this.model.get('title') || 'Untitled section';
        var section_header = template({ section_title: title });
        var section_header_el = this.$el.find('.section-header');

        section_header_el.html(section_header);

        var edit_buttons_el = this.$el.find(
            '.section-header .section-edit-buttons'
        );

        if (
            this.model.collection.size() == 1 ||
            this.model.get('number') == 1
        ) {
            edit_buttons_el.find('.move-up').hide();
        }

        if (
            this.model.collection.size() == 1 ||
            this.model.get('number') == this.model.collection.length
        ) {
            edit_buttons_el.find('.move-down').hide();
        }

        if (this.model.collection.size() == 1) {
            edit_buttons_el.find('.remove').hide();
        }

    },

    renderSidebar: function() {

        var sectionSidebar = new SectionSidebar({
            section: this.model,
            edit: false
        });

        var sectionSidebarView = new SectionSidebarView({
            model: sectionSidebar
        });

        this.$el.find('.section-sidebar').replaceWith(
            sectionSidebarView.render().el
        );

    },

    renderLines: function() {

        var lineViews = [];
        var lineView;

        this.model.get('lines').each(function(line) {

            lineView = new LineView({
                model: line
            });

            lineViews.push(lineView.render().el);

        });

        var lines_el = this.$el.find('.lines');

        lines_el.html('');
        lines_el.append(lineViews);

    },

    moveUp: function() {

        this.$el.after(this.$el.prev());

        var this_section_number = this.model.get('number');

        var prev_section = this.model.collection.find(
            function(section) {
                return section.get('number') == this_section_number - 1;
            }
        );

        var prev_section_number = prev_section.get('number');
        prev_section.set('number', this_section_number);
        this.model.set('number', prev_section_number);
        this.model.collection.sort();

        this.model.trigger('change');
        prev_section.trigger('change');

        this.model.save();
        prev_section.save();

    },

    moveDown: function() {

        this.$el.before(this.$el.next());

        var this_section_number = this.model.get('number');

        var next_section = this.model.collection.find(
            function(section) {
                return section.get('number') == this_section_number + 1;
            }
        );

        var next_section_number = next_section.get('number');
        next_section.set('number', this_section_number);
        this.model.set('number', next_section_number);
        this.model.collection.sort();

        this.model.trigger('change');
        next_section.trigger('change');

        this.model.save();
        next_section.save();

    },

    /**
     * Adds a line in this section.
     */
    addLine: function() {

        var last_line = this.model.get('lines').last();
        var new_line = last_line.copy({
            number: last_line.get('number') + 1
        });

        var new_measure = new_line.get('measures').first().copy();

        new_measure.unset('next_measure');
        new_line.get('measures').reset([new_measure]);

        this.model.get('lines').add(new_line);
        this.render();
        new_line.saveRecursive();

    },

    removeSection: function() {

        if (confirm("Are you sure you want to remove this section?")) {

            var collection = this.model.collection;

            this.model.destroy();
            this.remove();

            collection.resetNumbers();

            if (collection.size() == 1) {
                // If there is only one section left, the move
                // and remove buttons should be removed. So we
                // trigger a 'change' event so that it will
                // rerender itself.
                collection.first().trigger('change');
            }

        }

    },

});

},{"../init/section_edit.js":15,"../models/line.js":26,"../models/section_sidebar.js":34,"./line.js":42,"./section_sidebar.js":49}],48:[function(require,module,exports){
var Section = require('../models/section.js');
var SectionKey = require('../models/section_key.js');
var transposeWidget = require('../init/transpose_widget.js');
var KeySelectWidget = require('../../../core/widgets/key_select.js');


module.exports = Backbone.View.extend({

    model: Section,

    events: {
        'change input[type=radio]': 'changeSectionTitle',
        'click input[type=radio]': 'changeSectionTitle',
        'keyup .title-input': 'titleChanged',
        'click .close': 'close'
    },

    initialize: function() {

        var that = this;
        var keySelectWidgetDelegate = function() { };

        keySelectWidgetDelegate.key_changed = function(key) {
            that.updateKey(key);
        };

        this.keySelectWidget = new KeySelectWidget(
            this.$el.find('.key-select-widget'),
            keySelectWidgetDelegate
        );

        this.listenTo(this.model, 'change', this.change);

    },

    change: function() {

        if (this.model.get('visible')) {
            this.show();
        } else {
            this.$el.hide();
            this.model.get('section').save();
        }

    },

    close: function() {
        this.model.set('visible', false);
    },

    show: function() {

        this.$el.css({
            'top': this.model.get('offset').top + 42,
            'left': this.model.get('offset').left - 15
        });

        this.$el.find('.title-input').val(
            this.model.get('section').get('title')
        );

        if (this.model.get('section').get('title')) {
            this.$el.find('.title-radio').prop('checked', true);
        } else {
            this.$el.find('.no-title-radio').prop('checked', true);
        }

        this.keySelectWidget.updateKey(
            this.model.get('section').get('key')
        );

        this.$el.show();

        var title_input = this.$el.find('.title-input');

        // set focus on text field
        title_input.focus();

        // make sure the cursor is at the end
        var orig_value = title_input.val();
        title_input.val('');
        title_input.val(orig_value);

    },

    changeSectionTitle: function() {

        this.model.get('section').set(
            'title', 
            this.$el.find('.title-input').val().trim()
        );

        this.$el.find('.title-input').focus();

    },

    titleChanged: function(event) {
        this.changeSectionTitle();
        if (event.key == 'Enter') {
            this.close();
        }
    },

    updateKey: function(new_key) {

        this.model.get('section').set('key', new_key);
        new SectionKey({ section: this.model.get('section') }).save();

        if (this.model.get('section').get('number') == 1) {
            transposeWidget.set('key', new_key);
        }

    }

});

},{"../../../core/widgets/key_select.js":53,"../init/transpose_widget.js":18,"../models/section.js":31,"../models/section_key.js":33}],49:[function(require,module,exports){
var lineEdit = require('../init/line_edit.js');


module.exports = Backbone.View.extend({

    tagName: 'div',
    className: 'section-sidebar',

    initialize: function() {

        this.sidebar_template = _.template(
            $('#template-section-sidebar-part').html()
        );

        this.initListeners();

    },

    events: {
        'mouseover': 'mouseover',
        'mouseout': 'mouseout',
        'click': 'click'
    },

    initListeners: function() {
        this.stopListening();
        this.listenTo(this.model, 'change', this.render);
    },

    mouseover: function() {
        if (GLOBALS.edit) {
            this.model.set('mouseover', true);
        }
    },

    mouseout: function(event) {

        // A mouseout event is triggered when we append childs
        // to the section-sidebar div. So we check here if the
        // `event.relatedTarget` (which is the element the mouse
        // is now on) is a child of the sidebar.
        // If so, don't put `edit` to `false`.
        if ($(event.relatedTarget).closest('.section-sidebar').length) {
            return;
        }

        this.model.set('mouseover', false);

    },

    click: function(event) {

        if (!GLOBALS.edit) {
            return;
        }

        if (this.model.get('section').get('show_sidebar')) {

            var that = this;
            var target = $(event.target);
            var line_number = target.closest('.section-sidebar-part').data('line-number');
            var line = this.model.get('section').get('lines').findWhere({
                number: line_number
            });

            if (
                lineEdit.get('visible') &&
                lineEdit.get('line') == line
            ) {
                lineEdit.set('visible', false);
                this.model.set('forceMode', false);
            } else {

                lineEdit.set({
                    visible: true,
                    section_sidebar: this.model,
                    section: this.model.get('section'),
                    line: line,
                    offset: target.offset(),
                    onClose: function() {
                        that.model.set('forceMode', false);
                    }
                });

                this.model.set('forceMode', 'edit', { silent: true });

            }

        } else {
            this.model.get('section').set('show_sidebar', true).save();
            this.render();
        }

    },

    render: function() {

        this.$el.html('');
        this.$el.css({
            'height': this.model.get('section').height(),
            'width': GLOBALS.settings.section_sidebar_width
        });

        this.renderLetters();

        return this;

    },

    renderLetters: function() {

        var mode;
        var show_sidebar = this.model.get('section').get('show_sidebar');
        var mouseover = this.model.get('mouseover');

        if (show_sidebar || mouseover) {

            mode = this.model.get('forceMode');

            if (!mode) {
                if (show_sidebar) {
                    if (mouseover) {
                        mode = 'edit';
                    } else {
                        mode = 'active';
                    }
                } else {
                    mode = 'inactive';
                }
            }

            if (mode == 'edit') {
                this.renderLetterEdit(mode);
            } else {
                this.renderLetterParts(mode);
            }

        }

    },

    renderLetterParts: function(mode) {

        var that = this;
        var parts = this.getLetterParts();

        _.each(parts, function(part) {

            var height = part.lines_number * GLOBALS.settings.box_height;

            var part_el = $(that.sidebar_template({
                mode: mode,
                line_number: null,
                letter: part.letter,
                height: height,
                width: GLOBALS.settings.section_sidebar_width
            }));

            that.$el.append(part_el);

            if (part.lines_number > 1) {
                that.addIndicatorLines(
                    part_el.find('canvas')[0],
                    height,
                    mode
                );
            }

        });
        
    },

    /**
     * Returns the parts for the letters.
     *
     * A part is one or more lines that form one subsection of
     * the song. It has two fields:
     * letter        - The letter for this part.
     * lines_number  - Number of subsequent lines that share
     *                 this letter.
     */
    getLetterParts: function() {

        var parts = [];
        var prev_line = false;
        var lines_number = 0;

        this.model.get('section').get('lines').each(function(line) {

            if (
                prev_line &&
                (
                    prev_line.get('letter') != line.get('letter') ||
                    !prev_line.get('merge_with_next_line')
                )
            ) {

                parts.push({
                    letter: prev_line.get('letter'),
                    lines_number: lines_number
                });

                lines_number = 0;

            }

            lines_number++;
            prev_line = line;

        });

        parts.push({
            letter: prev_line.get('letter'),
            lines_number: lines_number
        });

        return parts;

    },

    addIndicatorLines: function(canvas_el, height, mode) {

        var width = GLOBALS.settings.section_sidebar_width;
        var sidebar_half_width = Math.round(width / 2);
        var box_height = GLOBALS.settings.box_height;
        var line_margin = Math.round(box_height * 0.15);
        var section_half_height = Math.round(height / 2);

        canvas_el.height = height;
        canvas_el.width = width;
        var context = canvas_el.getContext('2d');

        context.lineWidth = GLOBALS.settings.border_width;

        if (mode == 'inactive') {
            context.strokeStyle = '#CCC';
        }

        // from top to title
        context.beginPath();

        context.moveTo(sidebar_half_width, line_margin);
        context.lineTo(
            sidebar_half_width,
            (section_half_height - 5 - line_margin)
        );
        context.stroke();

        // from title to bottom
        context.beginPath();
        context.moveTo(
            sidebar_half_width,
            section_half_height + 5 + line_margin
        );
        context.lineTo(
            sidebar_half_width,
            (height - line_margin)
        );
        context.stroke();

        // from top to right
        context.beginPath();
        context.moveTo(sidebar_half_width, line_margin);
        context.lineTo(width - 5, line_margin);
        context.stroke();

        // from bottom to right
        context.beginPath();
        context.moveTo(
            sidebar_half_width,
            (height - line_margin)
        );
        context.lineTo(
            width - 5,
            (height - line_margin)
        );
        context.stroke();

    },

    renderLetterEdit: function(mode) {

        var that = this;

        this.model.get('section').get('lines').each(function(line) {

            var letter_el = $(that.sidebar_template({
                mode: mode,
                line_number: line.get('number'),
                letter: line.get('letter'),
                height: GLOBALS.settings.box_height,
                width: GLOBALS.settings.section_sidebar_width
            }));

            that.$el.append(letter_el);

        });

    }

});

},{"../init/line_edit.js":13}],50:[function(require,module,exports){
module.exports = Backbone.View.extend({

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click h1': 'toggle',
        'keyup .song-name-input': 'updateSongName'
    },

    toggle: function() {
        this.model.set('visible', !this.model.get('visible'));
    },

    render: function() {

        if (this.model.get('visible')) {
            this.$el.find('.song-name-change').show();
            this.focusTextField();
        } else {
            this.$el.find('.song-name-change').hide();
        }

    },

    focusTextField: function() {

        var song_name_input = this.$el.find('.song-name-input');

        // set focus on text field
        song_name_input.focus();

        // make sure the cursor is at the end
        var orig_value = song_name_input.val();
        song_name_input.val('');
        song_name_input.val(orig_value);

    },

    updateSongName: function() {

        var song_name = this.$el.find('.song-name-input').val();

        console.log('model url:');
        console.log(this.model.url);
        this.model.set('song_name', song_name);
        this.model.save();

        this.$el.find('h1 span').text(song_name);

    }

});

},{}],51:[function(require,module,exports){
var ChartTranspose = require('../models/chart_transpose.js');


module.exports = Backbone.View.extend({

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click .closed': 'toggle',
        'click .open .current-key': 'toggle',
        'click .key-tonics li a': 'changeKey'
    },

    toggle: function() {
        this.model.set('visible', !this.model.get('visible'));
    },

    render: function() {

        if (this.model.get('visible')) {
            this.$el.find('.open').show();
        } else {
            this.$el.find('.open').hide();
        }

        if (this.model.has('key')) {

            var key = this.model.get('key');

            this.$el.find('.key-name').html(key.get('name'));

            this.$el.find('.key-tonics li').removeClass('selected');
            this.$el.find(
                '.key-tonics li[data-key-tonic=' +
                    key.get('tonic') +
                ']'
            ).addClass('selected');

        }

    },

    changeKey: function(el) {

        if (!GLOBALS.edit) {
            return;
        }

        var target = $(el.target);

        new ChartTranspose({
            tonic: target.parent().data('key-tonic')
        }).save(null, { success: function() {
            // Refresh the page so that the transposition will
            // be visible on the screen. A simple solution for
            // now. We don't want to put the tonic in the URL
            // because:
            // If you change the key of the first section, you
            // thus change the key for the complete chart, if
            // the key would be in the URL and you would refresh
            // the page, you would transpose the chart again,
            // which is not what you want.
            location.reload();
        }});

    }

});

},{"../models/chart_transpose.js":20}],52:[function(require,module,exports){
var Note = Backbone.Model.extend();

var Notes = Backbone.Collection.extend({
    model: Note
});

var Key = Backbone.Model.extend({

    initialize: function() {
        this.initData();
    },

    initData: function() {

        // Only set notes if it hasn't been set yet. Prevents errors
        // when cloning.
        if(!(this.get('notes') instanceof Backbone.Collection)) {

            var that = this;
            var notes = new Notes();

            _.each(this.get('notes'), function(note_data) {
                note_data.key = that;
                notes.push(note_data);
            });

            this.set('notes', notes);

        }

    },

    /**
     * Get the note of this key at `distance_from_root`.
     */
    note: function(distance_from_root) {
        return this.get('notes').findWhere({
            distance_from_root: distance_from_root
        });
    },

});

var Keys = Backbone.Collection.extend({
    model: Key
});

var keys = new Keys();

_.each(GLOBALS.all_keys, function(key) {
    keys.add(key);
});

module.exports = keys;

},{}],53:[function(require,module,exports){
var allKeys = require('./all_keys.js');


function KeySelect(key_select_el, delegate) {

    this.key_select_el = key_select_el;
    this.delegate = delegate;

    this.tonic = 'C';
    this.tonality = 1;

    this.tonic_el = this.key_select_el.find('.tonic');
    this.tonic_currently_selected_el = this.tonic_el.find('.currently-selected');
    this.tonic_choices_el = this.tonic_el.find('.tonic-choices');
    this.tonality_el = this.key_select_el.find('.tonality');
    this.tonality_text_el = this.tonality_el.find('span');

    this.initKeyTonic();
    this.initKeyTonality();

    return this;

}

KeySelect.prototype.initKeyTonic = function() {

    var that = this;

    this.tonic_currently_selected_el.click(function() {
        that.tonic_choices_el.toggle();
    });

    this.tonic_el.find('.tonic-choices ul li').click(function(el) {
        var tonic = $(el.target).data('tonic');
        that.updateTonic(tonic);
        that.notifyDelegate();
    });

    $('html').click(function(el) {

        if (
            !$(el.target).closest('.tonic').length &&
            !$(el.target).closest('.tonic-choices').length
        ) {
            that.tonic_choices_el.hide();
        }

    });

};

KeySelect.prototype.initKeyTonality = function() {

    var that = this;

    this.tonality_el.click(function() {

        var tonality;

        if (that.tonality_text_el.html() == 'Major') {
            tonality = 2;
        } else {
            tonality = 1;
        }

        that.updateTonality(tonality);
        that.notifyDelegate();

    });

};

KeySelect.prototype.updateTonic = function(tonic) {

    this.tonic = tonic;
    this.tonic_currently_selected_el.html(this.tonic);

    this.tonic_choices_el.find('li.selected').removeClass('selected');
    this.tonic_choices_el.find(
        'li[data-tonic=' + this.tonic + ']'
    ).addClass('selected');
    this.tonic_choices_el.hide();

};

KeySelect.prototype.updateKey = function(key) {
    this.updateTonic(key.get('tonic'));
    this.updateTonality(key.get('tonality'));
};

KeySelect.prototype.updateTonality = function(tonality) {

    this.tonality = tonality;

    if (this.tonality == 1) {
        tonality_text = 'Major';
    } else {
        tonality_text = 'Minor';
    }

    this.tonality_text_el.html(tonality_text);

};

KeySelect.prototype.notifyDelegate = function() {

    if (this.delegate) {

        this.delegate.key_changed(
            allKeys.findWhere({
                tonic: this.tonic,
                tonality: this.tonality
            })
        );

    }

};

module.exports = KeySelect;

},{"./all_keys.js":52}],54:[function(require,module,exports){
function Measure(
    measure_el,
    beat_schema,
    box_width,
    box_height,
    border_width
) {

    this.measure_el = measure_el;
    this.beat_schema = beat_schema;
    this.box_width = box_width;
    this.box_height = box_height;
    this.border_width = border_width;

    return this;

}

Measure.prototype.measure_draw_separation_lines = function() {

    var canvas;
    var context;

    switch(this.beat_schema) {

        case '2-2':

            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');

            canvas.style.position = 'absolute';
            canvas.width = this.box_width;
            canvas.height = this.box_height;

            context.lineWidth = this.border_width;

            context.beginPath();
            context.moveTo(this.box_width, 0);
            context.lineTo(0, this.box_height);
            context.stroke();

            this.measure_el.prepend(canvas);

            break;

        case '2-1-1':

            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');

            canvas.style.position = 'absolute';
            canvas.width = this.box_width;
            canvas.height = this.box_height;

            context.lineWidth = this.border_width;

            context.beginPath();
            context.moveTo(this.box_width, 0);
            context.lineTo(0, this.box_height);
            context.stroke();

            context.beginPath();
            context.moveTo(this.box_width / 2, this.box_height / 2);
            context.lineTo(this.box_width, this.box_height);
            context.stroke();

            this.measure_el.prepend(canvas);

            break;

        case '1-1-2':

            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');

            canvas.style.position = 'absolute';
            canvas.width = this.box_width;
            canvas.height = this.box_height;

            context.lineWidth = this.border_width;

            context.beginPath();
            context.moveTo(this.box_width, 0);
            context.lineTo(0, this.box_height);
            context.stroke();

            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(this.box_width / 2, this.box_height / 2);
            context.stroke();

            this.measure_el.prepend(canvas);

            break;

        case '1-1-1-1':

            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');

            canvas.style.position = 'absolute';
            canvas.width = this.box_width;
            canvas.height = this.box_height;

            context.lineWidth = this.border_width;

            context.beginPath();
            context.moveTo(this.box_width, 0);
            context.lineTo(0, this.box_height);
            context.stroke();

            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(this.box_width, this.box_height);
            context.stroke();

            this.measure_el.prepend(canvas);

            break;

    }

};

module.exports = Measure;

},{}]},{},[1])