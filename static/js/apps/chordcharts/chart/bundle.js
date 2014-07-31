(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ChordEditChordType = require('../models/chord_edit_chord_type.js');


module.exports = Backbone.Collection.extend({
    model: ChordEditChordType
});

},{"../models/chord_edit_chord_type.js":23}],2:[function(require,module,exports){
var ChordEditNote = require('../models/chord_edit_note.js');


module.exports = Backbone.Collection.extend({
    model: ChordEditNote
});

},{"../models/chord_edit_note.js":24}],3:[function(require,module,exports){
var ChordType = require('../models/chord_type.js');


module.exports = Backbone.Collection.extend({
    model: ChordType
});

},{"../models/chord_type.js":25}],4:[function(require,module,exports){
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

},{"../models/chord.js":21}],5:[function(require,module,exports){
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

},{"../models/line.js":26}],6:[function(require,module,exports){
var MeasureEditMeasure = require('../models/measure_edit_measure.js');


module.exports = Backbone.Collection.extend({
    model: MeasureEditMeasure
});

},{"../models/measure_edit_measure.js":30}],7:[function(require,module,exports){
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

},{"../models/measure.js":28}],8:[function(require,module,exports){
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

},{"../models/section.js":31}],9:[function(require,module,exports){
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

},{"../models/chord_edit.js":22,"../views/chord_edit.js":39}],10:[function(require,module,exports){
var ChordTypes = require('../collections/chord_types.js');


var chord_types = new ChordTypes();

_.each(GLOBALS.chord_types, function(chord_type) {
    chord_types.add(chord_type);
});

module.exports = chord_types;

},{"../collections/chord_types.js":3}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"../models/line_edit.js":27,"../views/line_edit.js":43}],13:[function(require,module,exports){
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

},{"../models/measure_edit.js":29,"../views/measure_edit.js":45}],14:[function(require,module,exports){
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

},{"../models/section_edit.js":32,"../views/section_edit.js":48}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"../models/song_name_change_widget.js":35,"../views/song_name_change_widget.js":50}],17:[function(require,module,exports){
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

},{"../models/transpose_widget.js":36,"../views/transpose_widget.js":51}],18:[function(require,module,exports){
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

},{"./init/help_widget.js":11,"./init/settings_widget.js":15,"./init/song_name_change_widget.js":16,"./init/transpose_widget.js":17,"./models/chart.js":19,"./views/chart.js":37,"./views/chord.js":38,"./views/line.js":42,"./views/measure.js":44,"./views/section.js":47}],19:[function(require,module,exports){
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

},{"../collections/sections.js":8}],20:[function(require,module,exports){
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
var allKeys = require('../widgets/all_keys.js');


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

},{"../init/chord_types.js":10,"../widgets/all_keys.js":52}],22:[function(require,module,exports){
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

},{"../collections/measures.js":7}],27:[function(require,module,exports){
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

},{"../collections/chords.js":4}],29:[function(require,module,exports){
module.exports=require(22)
},{}],30:[function(require,module,exports){
module.exports=require(22)
},{}],31:[function(require,module,exports){
var Lines = require('../collections/lines.js');
var allKeys = require('../widgets/all_keys.js');


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

},{"../collections/lines.js":5,"../widgets/all_keys.js":52}],32:[function(require,module,exports){
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

},{"../collections/lines.js":5,"../collections/measures.js":7,"../models/chart.js":19,"./section.js":47}],38:[function(require,module,exports){
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

},{"../init/chord_edit.js":9,"../models/chord.js":21}],39:[function(require,module,exports){
var ChordEditNotes = require('../collections/chord_edit_notes.js');
var ChordEditChordTypes = require('../collections/chord_edit_chord_types.js');
var ChordEdit = require('../models/chord_edit.js');
var ChordEditNote = require('../models/chord_edit_note.js');
var chordTypes = require('../init/chord_types.js');
var allKeys = require('../widgets/all_keys.js');
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

},{"../collections/chord_edit_chord_types.js":1,"../collections/chord_edit_notes.js":2,"../init/chord_types.js":10,"../models/chord_edit.js":22,"../models/chord_edit_note.js":24,"../widgets/all_keys.js":52,"./chord_edit_chord_type.js":40,"./chord_edit_note.js":41}],40:[function(require,module,exports){
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
var MeasureWidget = require('../widgets/measure.js');
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

},{"../init/measure_edit.js":13,"../models/measure.js":28,"../widgets/measure.js":54,"./chord.js":38}],45:[function(require,module,exports){
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

},{"../collections/measure_edit_measures.js":6,"../models/measure_edit.js":29,"../models/measure_edit_measure.js":30,"./measure_edit_measure.js":46}],46:[function(require,module,exports){
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

},{"../init/section_edit.js":14,"../models/line.js":26,"../models/section_sidebar.js":34,"./line.js":42,"./section_sidebar.js":49}],48:[function(require,module,exports){
var Section = require('../models/section.js');
var SectionKey = require('../models/section_key.js');
var transposeWidget = require('../init/transpose_widget.js');
var KeySelectWidget = require('../widgets/key_select.js');


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

},{"../init/transpose_widget.js":17,"../models/section.js":31,"../models/section_key.js":33,"../widgets/key_select.js":53}],49:[function(require,module,exports){
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

},{"../init/line_edit.js":12}],50:[function(require,module,exports){
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

},{}]},{},[18])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvZW52L2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L2NvbGxlY3Rpb25zL2Nob3JkX2VkaXRfY2hvcmRfdHlwZXMuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC9jb2xsZWN0aW9ucy9jaG9yZF9lZGl0X25vdGVzLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvY29sbGVjdGlvbnMvY2hvcmRfdHlwZXMuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC9jb2xsZWN0aW9ucy9jaG9yZHMuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC9jb2xsZWN0aW9ucy9saW5lcy5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L2NvbGxlY3Rpb25zL21lYXN1cmVfZWRpdF9tZWFzdXJlcy5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L2NvbGxlY3Rpb25zL21lYXN1cmVzLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvY29sbGVjdGlvbnMvc2VjdGlvbnMuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC9pbml0L2Nob3JkX2VkaXQuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC9pbml0L2Nob3JkX3R5cGVzLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvaW5pdC9oZWxwX3dpZGdldC5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L2luaXQvbGluZV9lZGl0LmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvaW5pdC9tZWFzdXJlX2VkaXQuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC9pbml0L3NlY3Rpb25fZWRpdC5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L2luaXQvc2V0dGluZ3Nfd2lkZ2V0LmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvaW5pdC9zb25nX25hbWVfY2hhbmdlX3dpZGdldC5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L2luaXQvdHJhbnNwb3NlX3dpZGdldC5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L21haW4uanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC9tb2RlbHMvY2hhcnQuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC9tb2RlbHMvY2hhcnRfdHJhbnNwb3NlLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvbW9kZWxzL2Nob3JkLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvbW9kZWxzL2Nob3JkX2VkaXQuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC9tb2RlbHMvY2hvcmRfZWRpdF9jaG9yZF90eXBlLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvbW9kZWxzL2xpbmUuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC9tb2RlbHMvbWVhc3VyZS5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L21vZGVscy9zZWN0aW9uLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvbW9kZWxzL3NlY3Rpb25fa2V5LmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvbW9kZWxzL3NvbmdfbmFtZV9jaGFuZ2Vfd2lkZ2V0LmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvbW9kZWxzL3RyYW5zcG9zZV93aWRnZXQuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC92aWV3cy9jaGFydC5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L3ZpZXdzL2Nob3JkLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvdmlld3MvY2hvcmRfZWRpdC5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L3ZpZXdzL2Nob3JkX2VkaXRfY2hvcmRfdHlwZS5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L3ZpZXdzL2Nob3JkX2VkaXRfbm90ZS5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L3ZpZXdzL2xpbmUuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC92aWV3cy9saW5lX2VkaXQuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC92aWV3cy9tZWFzdXJlLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvdmlld3MvbWVhc3VyZV9lZGl0LmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvdmlld3MvbWVhc3VyZV9lZGl0X21lYXN1cmUuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC92aWV3cy9zZWN0aW9uLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvdmlld3Mvc2VjdGlvbl9lZGl0LmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvdmlld3Mvc2VjdGlvbl9zaWRlYmFyLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvdmlld3Mvc29uZ19uYW1lX2NoYW5nZV93aWRnZXQuanMiLCIvVXNlcnMvUmlrL2Rldi9qYXp6Y2hvcmRzL3NyYy9zdGF0aWMvanMvYXBwcy9jaG9yZGNoYXJ0cy9jaGFydC92aWV3cy90cmFuc3Bvc2Vfd2lkZ2V0LmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvY2hhcnQvd2lkZ2V0cy9hbGxfa2V5cy5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L3dpZGdldHMva2V5X3NlbGVjdC5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2NoYXJ0L3dpZGdldHMvbWVhc3VyZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyUUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQ2hvcmRFZGl0Q2hvcmRUeXBlID0gcmVxdWlyZSgnLi4vbW9kZWxzL2Nob3JkX2VkaXRfY2hvcmRfdHlwZS5qcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBDaG9yZEVkaXRDaG9yZFR5cGVcbn0pO1xuIiwidmFyIENob3JkRWRpdE5vdGUgPSByZXF1aXJlKCcuLi9tb2RlbHMvY2hvcmRfZWRpdF9ub3RlLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IENob3JkRWRpdE5vdGVcbn0pO1xuIiwidmFyIENob3JkVHlwZSA9IHJlcXVpcmUoJy4uL21vZGVscy9jaG9yZF90eXBlLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IENob3JkVHlwZVxufSk7XG4iLCJ2YXIgQ2hvcmQgPSByZXF1aXJlKCcuLi9tb2RlbHMvY2hvcmQuanMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblxuICAgIG1vZGVsOiBDaG9yZCxcblxuICAgIGNvcHk6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMpIHtcblxuICAgICAgICB2YXIgY29weSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgdmFyIGNob3JkX2NvcHk7XG4gICAgICAgIHZhciBjaG9yZHNfY29waWVzID0gW107XG5cbiAgICAgICAgY29weS5lYWNoKGZ1bmN0aW9uKGNob3JkKSB7XG4gICAgICAgICAgICBjaG9yZF9jb3B5ID0gY2hvcmQuY29weShhdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIGNob3Jkc19jb3BpZXMucHVzaChjaG9yZF9jb3B5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29weS5yZXNldChjaG9yZHNfY29waWVzKTtcblxuICAgICAgICByZXR1cm4gY29weTtcblxuICAgIH1cblxufSk7XG4iLCJ2YXIgTGluZSA9IHJlcXVpcmUoJy4uL21vZGVscy9saW5lLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG5cbiAgICBtb2RlbDogTGluZSxcblxuICAgIGNvcHk6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMpIHtcblxuICAgICAgICB2YXIgY29weSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgdmFyIGxpbmVfY29weTtcbiAgICAgICAgdmFyIGxpbmVfY29waWVzID0gW107XG5cbiAgICAgICAgY29weS5lYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIGxpbmVfY29weSA9IGxpbmUuY29weShhdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIGxpbmVfY29waWVzLnB1c2gobGluZV9jb3B5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29weS5yZXNldChsaW5lX2NvcGllcyk7XG5cbiAgICAgICAgcmV0dXJuIGNvcHk7XG5cbiAgICB9XG5cbn0pO1xuIiwidmFyIE1lYXN1cmVFZGl0TWVhc3VyZSA9IHJlcXVpcmUoJy4uL21vZGVscy9tZWFzdXJlX2VkaXRfbWVhc3VyZS5qcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBNZWFzdXJlRWRpdE1lYXN1cmVcbn0pO1xuIiwidmFyIE1lYXN1cmUgPSByZXF1aXJlKCcuLi9tb2RlbHMvbWVhc3VyZS5qcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuXG4gICAgbW9kZWw6IE1lYXN1cmUsXG5cbiAgICBpbml0UHJldk5leHRNZWFzdXJlczogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHByZXZfbWVhc3VyZSA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKG1lYXN1cmUpIHtcblxuICAgICAgICAgICAgaWYgKHByZXZfbWVhc3VyZSkge1xuICAgICAgICAgICAgICAgIHByZXZfbWVhc3VyZS5zZXQoJ25leHRfbWVhc3VyZScsIG1lYXN1cmUpO1xuICAgICAgICAgICAgICAgIG1lYXN1cmUuc2V0KCdwcmV2X21lYXN1cmUnLCBwcmV2X21lYXN1cmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmV2X21lYXN1cmUgPSBtZWFzdXJlO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgIGNvcHk6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMpIHtcblxuICAgICAgICB2YXIgY29weSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgdmFyIG1lYXN1cmVfY29weTtcbiAgICAgICAgdmFyIG1lYXN1cmVfY29waWVzID0gW107XG4gICAgICAgIHZhciBwcmV2X21lYXN1cmU7XG5cbiAgICAgICAgY29weS5lYWNoKGZ1bmN0aW9uKG1lYXN1cmUpIHtcbiAgICAgICAgICAgIG1lYXN1cmVfY29weSA9IG1lYXN1cmUuY29weShhdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIG1lYXN1cmVfY29waWVzLnB1c2gobWVhc3VyZV9jb3B5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29weS5yZXNldChtZWFzdXJlX2NvcGllcyk7XG4gICAgICAgIGNvcHkuaW5pdFByZXZOZXh0TWVhc3VyZXMoY29weS5tb2RlbHMpO1xuXG4gICAgICAgIHJldHVybiBjb3B5O1xuXG4gICAgfVxuXG59KTtcbiIsInZhciBTZWN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL3NlY3Rpb24uanMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblxuICAgIG1vZGVsOiBTZWN0aW9uLFxuXG4gICAgY29tcGFyYXRvcjogJ251bWJlcicsXG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIG51bWJlcnMgb24gdGhlIHNlY3Rpb25zLlxuICAgICAqXG4gICAgICogV2lsbCB0YWtlIHRoZSBjdXJyZW50IG9yZGVyIG9mIHRoZSBzZWN0aW9ucyBhbmQgcmVzZXQgdGhlXG4gICAgICogYG51bWJlcmAgZmllbGQsIHN0YXJ0aW5nIHdpdGggMSBhbmQgY291bnRpbmcgdXAuXG4gICAgICovXG4gICAgcmVzZXROdW1iZXJzOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgbnVtYmVyID0gMTtcblxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oc2VjdGlvbikge1xuICAgICAgICAgICAgc2VjdGlvbi5zZXQoJ251bWJlcicsIG51bWJlcisrKTtcbiAgICAgICAgICAgIHNlY3Rpb24uc2F2ZSgpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxufSk7XG4iLCJ2YXIgQ2hvcmRFZGl0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL2Nob3JkX2VkaXQuanMnKTtcbnZhciBDaG9yZEVkaXRWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvY2hvcmRfZWRpdC5qcycpO1xuXG5cbnZhciBjaG9yZEVkaXQgPSBuZXcgQ2hvcmRFZGl0KCk7XG5cbm5ldyBDaG9yZEVkaXRWaWV3KHtcbiAgICBlbDogJy5jaG9yZC1jaGFydCAuY2hvcmQtZWRpdCcsXG4gICAgbW9kZWw6IGNob3JkRWRpdFxufSk7XG5cbiQoJ2h0bWwnKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgLy8gQ2xvc2UgdGhlIHdpZGdldCBpZiB0aGVyZSB3YXMgYSBjbGljayBvdXRzaWRlIGl0LlxuXG4gICAgaWYgKGNob3JkRWRpdC5nZXQoJ3Zpc2libGUnKSkge1xuXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNsaWNrIHdhc24ndCBhIGNsaWNrIHRvIG9wZW4gdGhlIHdpZGdldCxcbiAgICAgICAgLy8gb3IgYSBjbGljayBpbnNpZGUgdGhlIHdpZGdldC5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIShcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xvc2VzdCgnLmNob3JkLWNoYXJ0JykubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgdGFyZ2V0Lmhhc0NsYXNzKCdjaG9yZC1uYW1lJylcbiAgICAgICAgICAgICkgJiZcbiAgICAgICAgICAgICF0YXJnZXRcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLmNob3JkLWVkaXQnKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuY2hvcmQtY2hhcnQnKVxuICAgICAgICAgICAgICAgIC5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBjbG9zZSB0aGUgd2lkZ2V0XG4gICAgICAgICAgICBjaG9yZEVkaXQuc2V0KCd2aXNpYmxlJywgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pO1xuXG4kKCdodG1sJykub24oJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIGlmIChjaG9yZEVkaXQuZ2V0KCd2aXNpYmxlJykgJiYgZXZlbnQua2V5ID09ICdFc2MnKSB7XG4gICAgICAgIGNob3JkRWRpdC5zZXQoJ3Zpc2libGUnLCBmYWxzZSk7XG4gICAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjaG9yZEVkaXQ7XG4iLCJ2YXIgQ2hvcmRUeXBlcyA9IHJlcXVpcmUoJy4uL2NvbGxlY3Rpb25zL2Nob3JkX3R5cGVzLmpzJyk7XG5cblxudmFyIGNob3JkX3R5cGVzID0gbmV3IENob3JkVHlwZXMoKTtcblxuXy5lYWNoKEdMT0JBTFMuY2hvcmRfdHlwZXMsIGZ1bmN0aW9uKGNob3JkX3R5cGUpIHtcbiAgICBjaG9yZF90eXBlcy5hZGQoY2hvcmRfdHlwZSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjaG9yZF90eXBlcztcbiIsInZhciBoZWxwX2J1dHRvbiA9ICQoJy5jaG9yZC1jaGFydCAuY2hhcnQtZWRpdC1idXR0b25zIC5idXR0b24uaGVscCcpO1xudmFyIHdpZGdldF9lbCA9ICQoJy5jaG9yZC1jaGFydCAuaGVscC13aWRnZXQnKTtcblxuaGVscF9idXR0b24uY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgd2lkZ2V0X2VsLnNob3coKTtcbn0pO1xuXG4kKCdodG1sJykuY2xpY2soZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIGlmICh3aWRnZXRfZWwuaXMoJzp2aXNpYmxlJykpIHtcblxuICAgICAgICB2YXIgdGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0YXJnZXRcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLmhlbHAtd2lkZ2V0JylcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLmNob3JkLWNoYXJ0JylcbiAgICAgICAgICAgICAgICAubGVuZ3RoICYmXG4gICAgICAgICAgICAhKFxuICAgICAgICAgICAgICAgIHRhcmdldFxuICAgICAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLmNoYXJ0LWVkaXQtYnV0dG9ucycpXG4gICAgICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuY2hvcmQtY2hhcnQnKVxuICAgICAgICAgICAgICAgICAgICAubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgdGFyZ2V0Lmhhc0NsYXNzKCdoZWxwJylcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB3aWRnZXRfZWwuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pO1xuXG4kKCdodG1sJykub24oJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIGlmICh3aWRnZXRfZWwuaXMoJzp2aXNpYmxlJykgJiYgZXZlbnQua2V5ID09ICdFc2MnKSB7XG4gICAgICAgIHdpZGdldF9lbC5oaWRlKCk7XG4gICAgfVxuXG59KTtcbiIsInZhciBMaW5lRWRpdCA9IHJlcXVpcmUoJy4uL21vZGVscy9saW5lX2VkaXQuanMnKTtcbnZhciBMaW5lRWRpdFZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9saW5lX2VkaXQuanMnKTtcbiAgICAgICAgXG5cbnZhciBsaW5lRWRpdCA9IG5ldyBMaW5lRWRpdCgpO1xuXG5uZXcgTGluZUVkaXRWaWV3KHtcbiAgICBlbDogJy5jaG9yZC1jaGFydCAubGluZS1lZGl0JyxcbiAgICBtb2RlbDogbGluZUVkaXRcbn0pO1xuXG4kKCdodG1sJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIC8vIENsb3NlIHRoZSB3aWRnZXQgaWYgdGhlcmUgd2FzIGEgY2xpY2sgb3V0c2lkZSBpdC5cblxuICAgIGlmIChsaW5lRWRpdC5nZXQoJ3Zpc2libGUnKSkge1xuXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNsaWNrIHdhc24ndCBhIGNsaWNrIHRvIG9wZW4gdGhlIHdpZGdldCxcbiAgICAgICAgLy8gb3IgYSBjbGljayBpbnNpZGUgdGhlIHdpZGdldC5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRhcmdldFxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuc2VjdGlvbi1zaWRlYmFyLXBhcnQnKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuY2hvcmQtY2hhcnQnKVxuICAgICAgICAgICAgICAgIC5sZW5ndGggJiZcbiAgICAgICAgICAgICF0YXJnZXRcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLmxpbmUtZWRpdCcpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJy5jaG9yZC1jaGFydCcpXG4gICAgICAgICAgICAgICAgLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIGNsb3NlIHRoZSB3aWRnZXRcbiAgICAgICAgICAgIGxpbmVFZGl0LnNldCgndmlzaWJsZScsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KTtcblxuJCgnaHRtbCcpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICBpZiAobGluZUVkaXQuZ2V0KCd2aXNpYmxlJykgJiYgZXZlbnQua2V5ID09ICdFc2MnKSB7XG4gICAgICAgIGxpbmVFZGl0LnNldCgndmlzaWJsZScsIGZhbHNlKTtcbiAgICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVFZGl0O1xuIiwidmFyIE1lYXN1cmVFZGl0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL21lYXN1cmVfZWRpdC5qcycpO1xudmFyIE1lYXN1cmVFZGl0VmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL21lYXN1cmVfZWRpdC5qcycpO1xuXG5cbnZhciBtZWFzdXJlRWRpdCA9IG5ldyBNZWFzdXJlRWRpdCgpO1xuXG5uZXcgTWVhc3VyZUVkaXRWaWV3KHtcbiAgICBlbDogJy5jaG9yZC1jaGFydCAubWVhc3VyZS1lZGl0JyxcbiAgICBtb2RlbDogbWVhc3VyZUVkaXRcbn0pO1xuXG4kKCdodG1sJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIC8vIENsb3NlIHRoZSB3aWRnZXQgaWYgdGhlcmUgd2FzIGEgY2xpY2sgb3V0c2lkZSBpdC5cblxuICAgIGlmIChtZWFzdXJlRWRpdC5nZXQoJ3Zpc2libGUnKSkge1xuXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNsaWNrIHdhc24ndCBhIGNsaWNrIHRvIG9wZW4gdGhlIHdpZGdldCxcbiAgICAgICAgICAgIC8vIG9yIGEgY2xpY2sgaW5zaWRlIHRoZSB3aWRnZXQuXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgIXRhcmdldFxuICAgICAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLm1lYXN1cmUtZWRpdCcpXG4gICAgICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuY2hvcmQtY2hhcnQnKVxuICAgICAgICAgICAgICAgICAgICAubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgIXRhcmdldFxuICAgICAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLm1lYXN1cmUnKVxuICAgICAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLmNob3JkLWNoYXJ0JylcbiAgICAgICAgICAgICAgICAgICAgLmxlbmd0aFxuICAgICAgICAgICAgKSB8fFxuICAgICAgICAgICAgLy8gT3IgdGhlIGNsaWNrIHdhcyBvbiBhIGNob3JkICh3aGljaCBpcyBhbHNvIGluc2lkZVxuICAgICAgICAgICAgLy8gYSBtZWFzdXJlKS5cbiAgICAgICAgICAgIHRhcmdldFxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuY2hvcmQtbmFtZScpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJy5jaG9yZCcpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJy5jaG9yZC1jaGFydCcpXG4gICAgICAgICAgICAgICAgLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIGNsb3NlIHRoZSB3aWRnZXRcbiAgICAgICAgICAgIG1lYXN1cmVFZGl0LnNldCgndmlzaWJsZScsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KTtcblxuJCgnaHRtbCcpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICBpZiAobWVhc3VyZUVkaXQuZ2V0KCd2aXNpYmxlJykgJiYgZXZlbnQua2V5ID09ICdFc2MnKSB7XG4gICAgICAgIG1lYXN1cmVFZGl0LnNldCgndmlzaWJsZScsIGZhbHNlKTtcbiAgICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lYXN1cmVFZGl0O1xuIiwidmFyIFNlY3Rpb25FZGl0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL3NlY3Rpb25fZWRpdC5qcycpO1xudmFyIFNlY3Rpb25FZGl0VmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3NlY3Rpb25fZWRpdC5qcycpO1xuXG5cbnZhciBzZWN0aW9uRWRpdCA9IG5ldyBTZWN0aW9uRWRpdCgpO1xuXG5uZXcgU2VjdGlvbkVkaXRWaWV3KHtcbiAgICBlbDogJy5jaG9yZC1jaGFydCAuc2VjdGlvbi1lZGl0JyxcbiAgICBtb2RlbDogc2VjdGlvbkVkaXRcbn0pO1xuXG4kKCdodG1sJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIC8vIENsb3NlIHRoZSB3aWRnZXQgaWYgdGhlcmUgd2FzIGEgY2xpY2sgb3V0c2lkZSBpdC5cblxuICAgIGlmIChzZWN0aW9uRWRpdC5nZXQoJ3Zpc2libGUnKSkge1xuXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNsaWNrIHdhc24ndCBhIGNsaWNrIHRvIG9wZW4gdGhlIHdpZGdldCxcbiAgICAgICAgLy8gb3IgYSBjbGljayBpbnNpZGUgdGhlIHdpZGdldC5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIShcbiAgICAgICAgICAgICAgICAvLyBjbGljayB3YXMgdG8gb3BlbiB0aGUgd2lkZ2V0XG4gICAgICAgICAgICAgICAgdGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuc2VjdGlvbi1oZWFkZXInKVxuICAgICAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLmNob3JkLWNoYXJ0JylcbiAgICAgICAgICAgICAgICAgICAgLmxlbmd0aCAmJlxuICAgICAgICAgICAgICAgIHRhcmdldC5oYXNDbGFzcygnbmFtZScpXG4gICAgICAgICAgICApICYmXG4gICAgICAgICAgICAvLyBjbGljayB3YXMgaW4gdGhlIHdpZGdldFxuICAgICAgICAgICAgIXRhcmdldFxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuc2VjdGlvbi1lZGl0JylcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLmNob3JkLWNoYXJ0JylcbiAgICAgICAgICAgICAgICAubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgICAgLy8gY2xvc2UgdGhlIHdpZGdldFxuICAgICAgICAgICAgc2VjdGlvbkVkaXQuc2V0KCd2aXNpYmxlJywgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pO1xuXG4kKCdodG1sJykub24oJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIGlmIChzZWN0aW9uRWRpdC5nZXQoJ3Zpc2libGUnKSAmJiBldmVudC5rZXkgPT0gJ0VzYycpIHtcbiAgICAgICAgc2VjdGlvbkVkaXQuc2V0KCd2aXNpYmxlJywgZmFsc2UpO1xuICAgIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2VjdGlvbkVkaXQ7XG4iLCJ2YXIgc2V0dGluZ3NfZWwgPSAkKCcuY2hvcmQtY2hhcnQgLmNoYXJ0LWVkaXQtYnV0dG9ucyAuc2V0dGluZ3MnKTtcbnZhciB3aWRnZXRfZWwgPSBzZXR0aW5nc19lbC5maW5kKCcud2lkZ2V0Jyk7XG5cbnNldHRpbmdzX2VsLmZpbmQoJy5sYWJlbCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIHdpZGdldF9lbC50b2dnbGUoKTtcbn0pO1xuXG53aWRnZXRfZWwuZmluZCgnLnN1Yi1idXR0b25zIC5zdWItYnV0dG9uLmRlbGV0ZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKGNvbmZpcm0oXCJBcmUgeW91IHJlYWxseSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGUgY2hhcnQ/XCIpKSB7XG4gICAgICAgICQodGhpcykuZmluZCgnZm9ybScpLnN1Ym1pdCgpO1xuICAgIH1cblxufSk7XG5cbiQoJ2h0bWwnKS5jbGljayhmdW5jdGlvbihldmVudCkge1xuXG4gICAgaWYgKHdpZGdldF9lbC5pcygnOnZpc2libGUnKSkge1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICEkKGV2ZW50LnRhcmdldClcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLnNldHRpbmdzJylcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLmNoYXJ0LWVkaXQtYnV0dG9ucycpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJy5jaG9yZC1jaGFydCcpXG4gICAgICAgICAgICAgICAgLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHdpZGdldF9lbC5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxufSk7XG5cbiQoJ2h0bWwnKS5vbigna2V5dXAnLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgaWYgKHdpZGdldF9lbC5pcygnOnZpc2libGUnKSAmJiBldmVudC5rZXkgPT0gJ0VzYycpIHtcbiAgICAgICAgd2lkZ2V0X2VsLmhpZGUoKTtcbiAgICB9XG5cbn0pO1xuIiwidmFyIFNvbmdOYW1lQ2hhbmdlV2lkZ2V0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL3NvbmdfbmFtZV9jaGFuZ2Vfd2lkZ2V0LmpzJyk7XG52YXIgU29uZ05hbWVDaGFuZ2VXaWRnZXRWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3Mvc29uZ19uYW1lX2NoYW5nZV93aWRnZXQuanMnKTtcblxuXG52YXIgc29uZ05hbWVDaGFuZ2VXaWRnZXQgPSBuZXcgU29uZ05hbWVDaGFuZ2VXaWRnZXQoKTtcblxubmV3IFNvbmdOYW1lQ2hhbmdlV2lkZ2V0Vmlldyh7XG4gICAgZWw6ICQoJy5jaG9yZC1jaGFydCAuY2hvcmQtY2hhcnQtaGVhZGVyIC5zb25nLW5hbWUnKSxcbiAgICBtb2RlbDogc29uZ05hbWVDaGFuZ2VXaWRnZXRcbn0pO1xuXG4kKCdodG1sJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIGlmIChzb25nTmFtZUNoYW5nZVdpZGdldC5nZXQoJ3Zpc2libGUnKSkge1xuXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRhcmdldFxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuc29uZy1uYW1lLWNoYW5nZScpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJy5zb25nLW5hbWUnKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuY2hvcmQtY2hhcnQnKVxuICAgICAgICAgICAgICAgIC5sZW5ndGggJiZcbiAgICAgICAgICAgICF0YXJnZXRcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnc3BhbicpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJ2gxJylcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnLnNvbmctbmFtZScpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJy5jaG9yZC1jaGFydCcpXG4gICAgICAgICAgICAgICAgLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHNvbmdOYW1lQ2hhbmdlV2lkZ2V0LnNldCgndmlzaWJsZScsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KTtcblxuJCgnaHRtbCcpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICBpZiAoc29uZ05hbWVDaGFuZ2VXaWRnZXQuZ2V0KCd2aXNpYmxlJykgJiYgZXZlbnQua2V5ID09ICdFc2MnKSB7XG4gICAgICAgIHNvbmdOYW1lQ2hhbmdlV2lkZ2V0LnNldCgndmlzaWJsZScsIGZhbHNlKTtcbiAgICB9XG5cbn0pO1xuXG5yZXR1cm4gc29uZ05hbWVDaGFuZ2VXaWRnZXQ7XG4iLCJ2YXIgVHJhbnNwb3NlV2lkZ2V0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL3RyYW5zcG9zZV93aWRnZXQuanMnKTtcbnZhciBUcmFuc3Bvc2VXaWRnZXRWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvdHJhbnNwb3NlX3dpZGdldC5qcycpO1xuXG5cbnZhciB0cmFuc3Bvc2VXaWRnZXQgPSBuZXcgVHJhbnNwb3NlV2lkZ2V0KCk7XG5cbm5ldyBUcmFuc3Bvc2VXaWRnZXRWaWV3KHtcbiAgICBlbDogJCgnLmNob3JkLWNoYXJ0IC5rZXktc2VsZWN0JyksXG4gICAgbW9kZWw6IHRyYW5zcG9zZVdpZGdldFxufSk7XG5cbiQoJ2h0bWwnKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgLy8gQ2xvc2UgdGhlIHdpZGdldCBpZiB0aGVyZSB3YXMgYSBjbGljayBvdXRzaWRlIGl0LlxuXG4gICAgaWYgKHRyYW5zcG9zZVdpZGdldC5nZXQoJ3Zpc2libGUnKSkge1xuXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNsaWNrIHdhc24ndCBhIGNsaWNrIHRvIG9wZW4gdGhlIHdpZGdldCxcbiAgICAgICAgLy8gb3IgYSBjbGljayBpbnNpZGUgdGhlIHdpZGdldC5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRhcmdldFxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcua2V5LXNlbGVjdCcpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJy5jaG9yZC1jaGFydCcpXG4gICAgICAgICAgICAgICAgLmxlbmd0aCAmJlxuICAgICAgICAgICAgIXRhcmdldFxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcuY3VycmVudC1rZXknKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCcub3BlbicpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJy5jaG9yZC1jaGFydCcpXG4gICAgICAgICAgICAgICAgLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRyYW5zcG9zZVdpZGdldC5zZXQoJ3Zpc2libGUnLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgIH1cblxufSk7XG5cbiQoJ2h0bWwnKS5vbigna2V5dXAnLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgaWYgKHRyYW5zcG9zZVdpZGdldC5nZXQoJ3Zpc2libGUnKSAmJiBldmVudC5rZXkgPT0gJ0VzYycpIHtcbiAgICAgICAgdHJhbnNwb3NlV2lkZ2V0LnNldCgndmlzaWJsZScsIGZhbHNlKTtcbiAgICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRyYW5zcG9zZVdpZGdldDtcbiIsInZhciBDaGFydCA9IHJlcXVpcmUoJy4vbW9kZWxzL2NoYXJ0LmpzJyk7XG52YXIgQ2hhcnRWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9jaGFydC5qcycpO1xudmFyIFNlY3Rpb25WaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9zZWN0aW9uLmpzJyk7XG52YXIgTGluZVZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2xpbmUuanMnKTtcbnZhciBNZWFzdXJlVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvbWVhc3VyZS5qcycpO1xudmFyIENob3JkVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvY2hvcmQuanMnKTtcblxucmVxdWlyZSgnLi9pbml0L3NvbmdfbmFtZV9jaGFuZ2Vfd2lkZ2V0LmpzJyk7XG5yZXF1aXJlKCcuL2luaXQvdHJhbnNwb3NlX3dpZGdldC5qcycpO1xucmVxdWlyZSgnLi9pbml0L3NldHRpbmdzX3dpZGdldC5qcycpO1xucmVxdWlyZSgnLi9pbml0L2hlbHBfd2lkZ2V0LmpzJyk7XG5cblxuLy8gQmluZCBkYXRhIGZyb20gc2VydmVyIHRvIG1vZGVscy9jb2xsZWN0aW9uc1xuXG52YXIgY2hhcnQgPSBuZXcgQ2hhcnQoR0xPQkFMUy5jaGFydF9kYXRhKTtcblxuXG4vLyBCaW5kIHZpZXdzIGFuZCBtb2RlbHMgdG8gZXhpc3RpbmcgSFRNTFxuXG52YXIgY2hhcnRWaWV3ID0gbmV3IENoYXJ0Vmlldyh7XG4gICAgZWw6ICcuY2hvcmQtY2hhcnQgLmNoYXJ0JyxcbiAgICBtb2RlbDogY2hhcnRcbn0pO1xuXG52YXIgc2VjdGlvbl9udW1iZXIgPSAwO1xuXG4vLyBMb29wIHRocm91Z2ggSFRNTCBlbGVtZW50cyBhbmQgY3JlYXRlIGFwcHJvcHJpYXRlIHZpZXdzL21vZGVscyBmb3IgdGhlc2Vcbi8vIGVsZW1lbnRzXG5jaGFydFZpZXcuJGVsLmZpbmQoJy5zZWN0aW9uJykuZWFjaChmdW5jdGlvbigpIHtcblxuICAgIHZhciBsaW5lX251bWJlciA9IDA7XG4gICAgdmFyIHNlY3Rpb24gPSBjaGFydC5nZXQoJ3NlY3Rpb25zJykubW9kZWxzW3NlY3Rpb25fbnVtYmVyXTtcbiAgICB2YXIgc2VjdGlvblZpZXcgPSBuZXcgU2VjdGlvblZpZXcoe1xuICAgICAgICBlbDogdGhpcyxcbiAgICAgICAgbW9kZWw6IHNlY3Rpb25cbiAgICB9KTtcbiAgICBjaGFydFZpZXcuJGVsLmFwcGVuZChzZWN0aW9uVmlldyk7XG5cbiAgICBzZWN0aW9uVmlldy4kZWwuZmluZCgnLmxpbmVzIC5saW5lJykuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgbWVhc3VyZV9udW1iZXIgPSAwO1xuICAgICAgICB2YXIgbGluZSA9IHNlY3Rpb24uZ2V0KCdsaW5lcycpLm1vZGVsc1tsaW5lX251bWJlcl07XG4gICAgICAgIHZhciBsaW5lVmlldyA9IG5ldyBMaW5lVmlldyh7XG4gICAgICAgICAgICBlbDogdGhpcyxcbiAgICAgICAgICAgIG1vZGVsOiBsaW5lXG4gICAgICAgIH0pO1xuICAgICAgICBzZWN0aW9uVmlldy4kZWwuYXBwZW5kKGxpbmVWaWV3KTtcblxuICAgICAgICBsaW5lVmlldy4kZWwuZmluZCgnLm1lYXN1cmUnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY2hvcmRfbnVtYmVyID0gMDtcbiAgICAgICAgICAgIHZhciBtZWFzdXJlID0gbGluZS5nZXQoJ21lYXN1cmVzJykubW9kZWxzW21lYXN1cmVfbnVtYmVyXTtcbiAgICAgICAgICAgIHZhciBtZWFzdXJlVmlldyA9IG5ldyBNZWFzdXJlVmlldyh7XG4gICAgICAgICAgICAgICAgZWw6IHRoaXMsXG4gICAgICAgICAgICAgICAgbW9kZWw6IG1lYXN1cmVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsaW5lVmlldy4kZWwuYXBwZW5kKG1lYXN1cmVWaWV3KTtcbiAgICAgICAgICAgIG1lYXN1cmVWaWV3LmRyYXdTZXBlcmF0aW9uTGluZXMoKTtcbiAgICAgICAgICAgIHZhciBjaG9yZF92aWV3cyA9IFtdO1xuXG4gICAgICAgICAgICBtZWFzdXJlVmlldy4kZWwuZmluZCgnLmNob3JkJykuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZhciBjaG9yZCA9IG1lYXN1cmUuZ2V0KCdjaG9yZHMnKS5tb2RlbHNbY2hvcmRfbnVtYmVyXTtcblxuICAgICAgICAgICAgICAgIGNob3JkX3ZpZXdzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDaG9yZFZpZXcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZWw6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDogY2hvcmRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGNob3JkX251bWJlcisrO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWVhc3VyZS5zZXQoeyBjaG9yZF92aWV3czogY2hvcmRfdmlld3MgfSwgeyBzaWxlbnQ6IHRydWUgfSk7XG4gICAgICAgICAgICBtZWFzdXJlX251bWJlcisrO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxpbmVfbnVtYmVyKys7XG5cbiAgICB9KTtcblxuICAgIHNlY3Rpb25WaWV3LnJlbmRlclNpZGViYXIoKTtcbiAgICBzZWN0aW9uX251bWJlcisrO1xuXG59KTtcblxuR0xPQkFMUy5wYXJzZWQgPSB0cnVlO1xuIiwidmFyIFNlY3Rpb25zID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvc2VjdGlvbnMuanMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBPbmx5IHNldCBzZWN0aW9ucyBpZiBpdCBoYXNuJ3QgYmVlbiBzZXQgeWV0LiBQcmV2ZW50cyBlcnJvcnNcbiAgICAgICAgLy8gd2hlbiBjbG9uaW5nLlxuICAgICAgICBpZiAoISh0aGlzLmdldCgnc2VjdGlvbnMnKSBpbnN0YW5jZW9mIEJhY2tib25lLkNvbGxlY3Rpb24pKSB7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHZhciBzZWN0aW9ucyA9IG5ldyBTZWN0aW9ucygpO1xuXG4gICAgICAgICAgICBzZWN0aW9ucy51cmwgPSAoXG4gICAgICAgICAgICAgICAgR0xPQkFMUy5hcGlfcm9vdF91cmwgKyAnY2hhcnRzLycgK1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCdpZCcpICsgJy9zZWN0aW9ucydcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLmdldCgnc2VjdGlvbnMnKSwgZnVuY3Rpb24oc2VjdGlvbl9kYXRhKSB7XG4gICAgICAgICAgICAgICAgc2VjdGlvbl9kYXRhLmNoYXJ0ID0gdGhhdDtcbiAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGQoc2VjdGlvbl9kYXRhKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnNldCgnc2VjdGlvbnMnLCBzZWN0aW9ucyk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG59KTtcbiIsIi8qXG4gKiBNb2RlbCBzcGVjaWFsbHkgZm9yIHRoZSBBUEkgc3luYyB0aGF0IHRyYW5zcG9zZXMgdGhlIGNoYXJ0LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cbiAgICB1cmw6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBHTE9CQUxTLmFwaV9yb290X3VybCArXG4gICAgICAgICAgICAnY2hhcnQtdHJhbnNwb3NlLycgK1xuICAgICAgICAgICAgR0xPQkFMUy5jaGFydF9kYXRhLmlkICsgJy8nXG4gICAgICAgICk7XG5cbiAgICB9LFxuXG4gICAgaXNOZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9uaWM6IHRoaXMuZ2V0KCd0b25pYycpXG4gICAgICAgIH07XG5cbiAgICB9XG5cbn0pO1xuIiwidmFyIGNob3JkVHlwZXMgPSByZXF1aXJlKCcuLi9pbml0L2Nob3JkX3R5cGVzLmpzJyk7XG52YXIgYWxsS2V5cyA9IHJlcXVpcmUoJy4uL3dpZGdldHMvYWxsX2tleXMuanMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHRoaXMuaW5pdERhdGEoKTtcbiAgICAgICAgdGhpcy5pbml0TGlzdGVuZXJzKCk7XG4gICAgfSxcblxuICAgIGluaXREYXRhOiBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAoIXRoaXMuaGFzKCdjaG9yZF90eXBlJykpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdENob3JkVHlwZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmdldCgna2V5JykpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEtleSgpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgaW5pdExpc3RlbmVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3RvcExpc3RlbmluZygpO1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMsICdjaGFuZ2UnLCB0aGlzLnBhcnNlTmV4dE1lYXN1cmUpO1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMsICdjaGFuZ2U6Y2hvcmRfdHlwZV9pZCcsIHRoaXMuaW5pdENob3JkVHlwZSk7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcywgJ2NoYW5nZTprZXlfaWQnLCB0aGlzLmluaXRLZXkpO1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMsICdjaGFuZ2U6Y2hvcmRfcGl0Y2gnLCB0aGlzLmluaXROb3RlKTtcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLCAnY2hhbmdlOmFsdF9iYXNzX3BpdGNoJywgdGhpcy5pbml0QWx0QmFzc05vdGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgY2hvcmQgdHlwZSBiYXNlZCBvbiB0aGUgY3VycmVudFxuICAgICAqIGBjaG9yZF90eXBlX2lkYC5cbiAgICAgKi9cbiAgICBpbml0Q2hvcmRUeXBlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXQoXG4gICAgICAgICAgICAnY2hvcmRfdHlwZScsXG4gICAgICAgICAgICBjaG9yZFR5cGVzLmdldCh0aGlzLmdldCgnY2hvcmRfdHlwZV9pZCcpKVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYG5vdGVgIGFuZCBgYWx0X2Jhc3Nfbm90ZWAgYmFzZWQgb24gdGhlXG4gICAgICogY3VycmVudCBrZXkuXG4gICAgICovXG4gICAgaW5pdEtleTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0KCdrZXknLCBhbGxLZXlzLmdldCh0aGlzLmdldCgna2V5X2lkJykpKTtcbiAgICAgICAgdGhpcy5pbml0Tm90ZSgpO1xuICAgICAgICB0aGlzLmluaXRBbHRCYXNzTm90ZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgbm90ZSBpbiB0aGUgY3VycmVudCBrZXlcbiAgICAgKi9cbiAgICBpbml0Tm90ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0KFxuICAgICAgICAgICAgJ25vdGUnLFxuICAgICAgICAgICAgdGhpcy5nZXQoJ2tleScpLm5vdGUodGhpcy5nZXQoJ2Nob3JkX3BpdGNoJykpXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBgYWx0X2Jhc3Nfbm90ZWAgaW4gdGhlIGN1cnJlbnQga2V5IGJhc2VkXG4gICAgICogb24gYGFsdF9iYXNzX3BpdGNoYCBpZiBpdCBpcyBvbiAoZGV0ZXJtaW5lZCBieVxuICAgICAqIHRoZSBgYWx0X2Jhc3NgIGJvb2xlYW4pLCBlbHNlIHNldHMgaXQgdG8gYGZhbHNlYC5cbiAgICAgKi9cbiAgICBpbml0QWx0QmFzc05vdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBhbHRfYmFzc19ub3RlO1xuXG4gICAgICAgIGlmICh0aGlzLmdldCgnYWx0X2Jhc3MnKSkge1xuICAgICAgICAgICAgYWx0X2Jhc3Nfbm90ZSA9IHRoaXMuZ2V0KCdrZXknKS5ub3RlKHRoaXMuZ2V0KCdhbHRfYmFzc19waXRjaCcpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsdF9iYXNzX25vdGUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0KCdhbHRfYmFzc19ub3RlJywgYWx0X2Jhc3Nfbm90ZSk7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUGFyc2VzIHRoZSBuZXh0IG1lYXN1cmUgYmFzZWQgb24gdGhpcyBtZWFzdXJlXG4gICAgICpcbiAgICAgKiBJZiB0aGlzIGFuZCB0aGUgbmV4dCBtZWFzdXJlIGFyZSBvbiB0aGUgc2FtZSBsaW5lIGFuZCBib3RoXG4gICAgICogaGF2ZSBiZWF0X3NjaGVtYSAnNCcgdGhlbjpcbiAgICAgKiAtIElmIHRoZSBjaG9yZHMgYXJlIHRoZSBzYW1lIE5PVywgdGhlbiBuZXh0IG1lYXN1cmUgd2lsbFxuICAgICAqICAgZGlzcGxheSB0aGUgcmVwZWF0IHNpZ24gKCAlICkuXG4gICAgICogLSBJZiB0aGUgY2hvcmQgYmVmb3JlIHRoZSBjaGFuZ2Ugb2YgdGhpcyBtZWFzdXJlIGFuZCB0aGVcbiAgICAgKiAgIG5leHQgY2hvcmQgd2VyZSB0aGUgc2FtZSwgdGhlbiBjaGFuZ2UgdGhlIGNob3JkIG9mIHRoZVxuICAgICAqICAgbmV4dCBtZWFzdXJlIHRvIHRoZSBjaG9yZCBvZiB0aGUgY3VycmVudCBtZWFzdXJlLlxuICAgICAqL1xuICAgIHBhcnNlTmV4dE1lYXN1cmU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICghR0xPQkFMUy5wYXJzZWQpIHtcbiAgICAgICAgICAgIC8vIG9ubHkgcGFyc2UgbmV4dCBtZWFzdXJlIGlmIHdob2xlIGNoYXJ0IGhhcyBiZWVuIGRvbmUgcGFyc2luZ1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5nZXQoJ2JlYXRzJykgPT0gNCAmJlxuICAgICAgICAgICAgdGhpcy5nZXQoJ21lYXN1cmUnKS5oYXMoJ25leHRfbWVhc3VyZScpICYmXG4gICAgICAgICAgICB0aGlzLmdldCgnbWVhc3VyZScpLmdldCgnbmV4dF9tZWFzdXJlJykuZ2V0KCdiZWF0X3NjaGVtYScpID09ICc0JyAmJlxuICAgICAgICAgICAgdGhpcy5nZXQoJ21lYXN1cmUnKS5nZXQoJ2xpbmUnKSA9PSB0aGlzLmdldCgnbWVhc3VyZScpLmdldCgnbmV4dF9tZWFzdXJlJykuZ2V0KCdsaW5lJylcbiAgICAgICAgKSB7XG5cbiAgICAgICAgICAgIHZhciBuZXh0X2Nob3JkID0gdGhpcy5nZXQoJ21lYXN1cmUnKS5nZXQoJ25leHRfbWVhc3VyZScpXG4gICAgICAgICAgICAgICAgLmdldCgnY2hvcmRzJykuZmlyc3QoKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGNob3JkcyBhcmUgdGhlIHNhbWUgTk9XXG4gICAgICAgICAgICAgICAgbmV4dF9jaG9yZC5nZXQoJ2Nob3JkX3BpdGNoJykgPT0gdGhpcy5nZXQoJ2Nob3JkX3BpdGNoJykgJiZcbiAgICAgICAgICAgICAgICBfLmlzRXF1YWwoXG4gICAgICAgICAgICAgICAgICAgIG5leHRfY2hvcmQuZ2V0KCdjaG9yZF90eXBlJykuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoJ2Nob3JkX3R5cGUnKS5hdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgKCFuZXh0X2Nob3JkLmdldCgnYWx0X2Jhc3MnKSAmJiAhdGhpcy5nZXQoJ2FsdF9iYXNzJykpIHx8XG4gICAgICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRfY2hvcmQuZ2V0KCdhbHRfYmFzcycpICYmIHRoaXMuZ2V0KCdhbHRfYmFzcycpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0X2Nob3JkLmdldCgnYWx0X2Jhc3NfcGl0Y2gnKSA9PSB0aGlzLmdldCgnYWx0X2Jhc3NfcGl0Y2gnKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIHRoZSBgcmVuZGVyKClgIGJ5IHNldHRpbmcgdGltZXN0YW1wIGluXG4gICAgICAgICAgICAgICAgLy8gbWlsbGlzZWNvbmRzIGluIGBjaGFuZ2VkYCBhdHRyaWJ1dGUuIFRoZW4gYHJlbmRlcigpYFxuICAgICAgICAgICAgICAgIC8vIHdpbGwgcHV0IHRoZSByZXBlYXQgc2lnbiAoICUgKSBpbi5cbiAgICAgICAgICAgICAgICB0aGlzLmdldCgnbWVhc3VyZScpLmdldCgnbmV4dF9tZWFzdXJlJykuZ2V0KCdjaG9yZHMnKS5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgIC5zZXQoJ2NoYW5nZWQnLCBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcHJldl9hdHRyID0gdGhpcy5wcmV2aW91c0F0dHJpYnV0ZXMoKTtcblxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgbWVhc3VyZSdzIGNob3JkIGJlZm9yZSB0aGUgY2hhbmdlXG4gICAgICAgICAgICAgICAgICAgIC8vIGlzIHRoZSBzYW1lIGFzIHRoZSBuZXh0IG1lYXN1cmUncyBjaG9yZFxuICAgICAgICAgICAgICAgICAgICBfLmlzRXF1YWwoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0X2Nob3JkLmdldCgnY2hvcmRfcGl0Y2gnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZfYXR0ci5jaG9yZF9waXRjaFxuICAgICAgICAgICAgICAgICAgICApICYmIF8uaXNFcXVhbChcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRfY2hvcmQuZ2V0KCdjaG9yZF90eXBlJykuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZfYXR0ci5jaG9yZF90eXBlLmF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICAgICAgKSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIW5leHRfY2hvcmQuZ2V0KCdhbHRfYmFzcycpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIXByZXZfYXR0ci5hbHRfYmFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgKSB8fCAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dF9jaG9yZC5nZXQoJ2FsdF9iYXNzJykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2X2F0dHIuYWx0X2Jhc3MgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRXF1YWwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRfY2hvcmQuZ2V0KCdhbHRfYmFzc19waXRjaCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2X2F0dHIuYWx0X2Jhc3NfcGl0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcblxuICAgICAgICAgICAgICAgICAgICBuZXh0X2Nob3JkLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnY2hvcmRfcGl0Y2gnOiB0aGlzLmdldCgnY2hvcmRfcGl0Y2gnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjaG9yZF90eXBlJzogdGhpcy5nZXQoJ2Nob3JkX3R5cGUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdhbHRfYmFzcyc6IHRoaXMuZ2V0KCdhbHRfYmFzcycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2FsdF9iYXNzX3BpdGNoJzogdGhpcy5nZXQoJ2FsdF9iYXNzX3BpdGNoJylcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dF9jaG9yZC5zYXZlKCk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZnVsbCBjaG9yZCBuYW1lXG4gICAgICovXG4gICAgY2hvcmROYW1lOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgYmFzc19ub3RlO1xuXG4gICAgICAgIGlmICh0aGlzLmdldCgnYWx0X2Jhc3MnKSkge1xuICAgICAgICAgICAgYmFzc19ub3RlID0gJy8nICsgdGhpcy5nZXQoJ2FsdF9iYXNzX25vdGUnKS5nZXQoJ25hbWUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJhc3Nfbm90ZSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuZ2V0KCdub3RlJykuZ2V0KCduYW1lJykgK1xuICAgICAgICAgICAgdGhpcy5nZXQoJ2Nob3JkX3R5cGUnKS5nZXQoJ2Nob3JkX291dHB1dCcpICtcbiAgICAgICAgICAgIGJhc3Nfbm90ZVxuICAgICAgICApO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHN0cmluZyB0aGF0IHNob3VsZCBiZSBvdXRwdXR0ZWQgb24gdGhlIGNoYXJ0LiBUaGlzXG4gICAgICogaXMgdXN1YWxseSB0aGUgY2hvcmROYW1lIGJ1dCBpbiBzb21lIGNhc2VzIHRoZSByZXBlYXQgc2lnbiAoICUgKVxuICAgICAqL1xuICAgIGNoYXJ0T3V0cHV0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAodGhpcy5nZXQoJ3Jlc3QnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdSRVNUJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoaXMgY2hvcmQgYW5kIHRoZSBwcmV2aW91cyBjaG9yZCdzIG1lYXN1cmVfc2NoZW1hIGFyZSBib3RoICc0J1xuICAgICAgICAvLyBhbmQgYXJlIG9uIHRoZSBzYW1lIGxpbmUgYW5kIGhhZCB0aGUgc2FtZSBjaG9yZCwgdXNlIHRoZSByZXBlYXRcbiAgICAgICAgLy8gc2lnbiAoICUgKS4gT3RoZXJ3aXNlIHVzZSB0aGUgY2hvcmROYW1lLlxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuZ2V0KCdiZWF0cycpID09IDQgJiZcbiAgICAgICAgICAgIHRoaXMuZ2V0KCdtZWFzdXJlJykuaGFzKCdwcmV2X21lYXN1cmUnKSAmJlxuICAgICAgICAgICAgdGhpcy5nZXQoJ21lYXN1cmUnKS5nZXQoJ2xpbmUnKSA9PSB0aGlzLmdldCgnbWVhc3VyZScpXG4gICAgICAgICAgICAgICAgLmdldCgncHJldl9tZWFzdXJlJykuZ2V0KCdsaW5lJykgJiZcbiAgICAgICAgICAgIHRoaXMuZ2V0KCdtZWFzdXJlJykuZ2V0KCdwcmV2X21lYXN1cmUnKVxuICAgICAgICAgICAgICAgIC5nZXQoJ2JlYXRfc2NoZW1hJykgPT0gJzQnICYmXG4gICAgICAgICAgICB0aGlzLmdldCgnbWVhc3VyZScpLmdldCgncHJldl9tZWFzdXJlJykuZ2V0KCdjaG9yZHMnKVxuICAgICAgICAgICAgLmZpcnN0KCkuY2hvcmROYW1lKCkgPT0gdGhpcy5jaG9yZE5hbWUoKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiAnJSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaG9yZE5hbWUoKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGNvcHk6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMpIHtcblxuICAgICAgICB2YXIgY29weSA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgY29weS5zZXQoe1xuICAgICAgICAgICAgaWQ6IG51bGxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGNvcHkuc2V0KGF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29weS5pbml0TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgcmV0dXJuIGNvcHk7XG5cbiAgICB9LFxuXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmVhdHM6IHRoaXMuZ2V0KCdiZWF0cycpLFxuICAgICAgICAgICAgY2hvcmRfcGl0Y2g6IHRoaXMuZ2V0KCdjaG9yZF9waXRjaCcpLFxuICAgICAgICAgICAgY2hvcmRfdHlwZV9pZDogdGhpcy5nZXQoJ2Nob3JkX3R5cGUnKS5nZXQoJ2lkJyksXG4gICAgICAgICAgICBhbHRfYmFzczogdGhpcy5nZXQoJ2FsdF9iYXNzJyksXG4gICAgICAgICAgICBhbHRfYmFzc19waXRjaDogdGhpcy5nZXQoJ2FsdF9iYXNzX3BpdGNoJyksXG4gICAgICAgICAgICByZXN0OiB0aGlzLmdldCgncmVzdCcpLFxuICAgICAgICAgICAgbnVtYmVyOiB0aGlzLmdldCgnbnVtYmVyJylcbiAgICAgICAgfTtcblxuICAgIH1cblxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCgpO1xuIiwidmFyIENob3JkVHlwZSA9IHJlcXVpcmUoJy4vY2hvcmRfdHlwZS5qcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXQoJ2Nob3JkX3R5cGUnLCBuZXcgQ2hvcmRUeXBlKHRoaXMuZ2V0KCdjaG9yZF90eXBlJykpKTtcbiAgICB9XG59KTtcbiIsInZhciBNZWFzdXJlcyA9IHJlcXVpcmUoJy4uL2NvbGxlY3Rpb25zL21lYXN1cmVzLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gT25seSBzZXQgbWVhc3VyZXMgaWYgaXQgaGFzbid0IGJlZW4gc2V0IHlldC4gUHJldmVudHMgZXJyb3JzXG4gICAgICAgIC8vIHdoZW4gY2xvbmluZy5cbiAgICAgICAgaWYgKCEodGhpcy5nZXQoJ21lYXN1cmVzJykgaW5zdGFuY2VvZiBCYWNrYm9uZS5Db2xsZWN0aW9uKSkge1xuXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgbWVhc3VyZXMgPSBuZXcgTWVhc3VyZXMoKTtcbiAgICAgICAgICAgIG1lYXN1cmVzLnVybCA9IHRoaXMubWVhc3VyZXNVcmwoKTtcblxuICAgICAgICAgICAgXy5lYWNoKHRoaXMuZ2V0KCdtZWFzdXJlcycpLCBmdW5jdGlvbihtZWFzdXJlX2RhdGEpIHtcbiAgICAgICAgICAgICAgICBtZWFzdXJlX2RhdGEubGluZSA9IHRoYXQ7XG4gICAgICAgICAgICAgICAgbWVhc3VyZXMuYWRkKG1lYXN1cmVfZGF0YSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWVhc3VyZXMuaW5pdFByZXZOZXh0TWVhc3VyZXMoKTtcblxuICAgICAgICAgICAgdGhpcy5zZXQoJ21lYXN1cmVzJywgbWVhc3VyZXMpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXRMaXN0ZW5lcnMoKTtcblxuICAgIH0sXG5cbiAgICBtZWFzdXJlc1VybDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVybCgpICsgJy9tZWFzdXJlcyc7XG4gICAgfSxcblxuICAgIGluaXRMaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnN0b3BMaXN0ZW5pbmcoKTtcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLmdldCgnbWVhc3VyZXMnKSwgJ3JlbW92ZScsIHRoaXMubWVhc3VyZVJlbW92ZWQpO1xuICAgIH0sXG5cbiAgICBwcmV2aW91czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNpYmxpbmcoLTEpO1xuICAgIH0sXG5cbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2libGluZygxKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2libGluZyBsaW5lIGluIHRoZSBjb2xsZWN0aW9uIHRoYXQgaXNcbiAgICAgKiBgZGlmZmVyZW5jZWAgYXdheSBmcm9tIHRoaXMgbGluZSwgd2hlcmUgYSBuZWdhdGl2ZVxuICAgICAqIGBkaWZmZXJlbmNlYCB3aWxsIHJldHVybiBhIHByZXZpb3VzIHNpYmxpbmcgYW5kIGFcbiAgICAgKiBwb3NpdGl2ZSBgZGlmZmVyZW5jZWAgYW4gdXBjb21pbmcgc2libGluZy5cbiAgICAgKi9cbiAgICBnZXRTaWJsaW5nOiBmdW5jdGlvbihkaWZmZXJlbmNlKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5maW5kV2hlcmUoe1xuICAgICAgICAgICAgbnVtYmVyOiB0aGlzLmdldCgnbnVtYmVyJykgKyBkaWZmZXJlbmNlXG4gICAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgIG1lYXN1cmVSZW1vdmVkOiBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAoIXRoaXMuZ2V0KCdtZWFzdXJlcycpLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBjb3B5OiBmdW5jdGlvbihhdHRyaWJ1dGVzKSB7XG5cbiAgICAgICAgdmFyIGNvcHkgPSB0aGlzLmNsb25lKCk7XG4gICAgICAgIGNvcHkuc2V0KHtcbiAgICAgICAgICAgIGlkOiBudWxsLFxuICAgICAgICAgICAgbWVhc3VyZXM6IHRoaXMuZ2V0KCdtZWFzdXJlcycpLmNvcHkoeyBsaW5lOiBjb3B5IH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBjb3B5LnNldChhdHRyaWJ1dGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvcHkuaW5pdExpc3RlbmVycygpO1xuXG4gICAgICAgIHJldHVybiBjb3B5O1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlY3Vyc2l2ZWx5IHNhdmVzIHRoaXMgbGluZSBhbmQgaXQncyBjaGlsZHJlbiAobWVhc3VyZXNcbiAgICAgKiBhbmQgY2hvcmRzKS5cbiAgICAgKi9cbiAgICBzYXZlUmVjdXJzaXZlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zYXZlKG51bGwsIHsgc3VjY2VzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGF0LmdldCgnbWVhc3VyZXMnKS51cmwgPSB0aGF0Lm1lYXN1cmVzVXJsKCk7XG4gICAgICAgICAgICB0aGF0LmdldCgnbWVhc3VyZXMnKS5lYWNoKGZ1bmN0aW9uKG1lYXN1cmUpIHtcbiAgICAgICAgICAgICAgICBtZWFzdXJlLnNhdmVSZWN1cnNpdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9fSk7XG5cbiAgICB9LFxuXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG51bWJlcjogdGhpcy5nZXQoJ251bWJlcicpLFxuICAgICAgICAgICAgbGV0dGVyOiB0aGlzLmdldCgnbGV0dGVyJyksXG4gICAgICAgICAgICBtZXJnZV93aXRoX25leHRfbGluZTogdGhpcy5nZXQoJ21lcmdlX3dpdGhfbmV4dF9saW5lJylcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pO1xuIiwidmFyIENob3JkcyA9IHJlcXVpcmUoJy4uL2NvbGxlY3Rpb25zL2Nob3Jkcy5qcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmluaXREYXRhKCk7XG4gICAgICAgIHRoaXMuaW5pdExpc3RlbmVycygpO1xuICAgIH0sXG5cbiAgICBpbml0RGF0YTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gT25seSBzZXQgY2hvcmRzIGlmIGl0IGhhc24ndCBiZWVuIHNldCB5ZXQuIFByZXZlbnRzIGVycm9yc1xuICAgICAgICAvLyB3aGVuIGNsb25pbmcuXG4gICAgICAgIGlmICghKHRoaXMuZ2V0KCdjaG9yZHMnKSBpbnN0YW5jZW9mIEJhY2tib25lLkNvbGxlY3Rpb24pKSB7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHZhciBjaG9yZHMgPSBuZXcgQ2hvcmRzKCk7XG4gICAgICAgICAgICBjaG9yZHMudXJsID0gdGhpcy5jaG9yZHNVcmwoKTtcblxuICAgICAgICAgICAgXy5lYWNoKHRoaXMuZ2V0KCdjaG9yZHMnKSwgZnVuY3Rpb24oY2hvcmRfZGF0YSkge1xuICAgICAgICAgICAgICAgIGNob3JkX2RhdGEubWVhc3VyZSA9IHRoYXQ7XG4gICAgICAgICAgICAgICAgY2hvcmRzLnB1c2goY2hvcmRfZGF0YSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zZXQoJ2Nob3JkcycsIGNob3Jkcyk7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGNob3Jkc1VybDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVybCgpICsgJy9jaG9yZHMnO1xuICAgIH0sXG5cbiAgICBpbml0TGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nKCk7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcywgJ2NoYW5nZScsIHRoaXMuY2hhbmdlKTtcbiAgICB9LFxuXG4gICAgY2hhbmdlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAodGhpcy5oYXNDaGFuZ2VkKCdiZWF0X3NjaGVtYScpKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJlYXRTY2hlbWEoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyTmV4dE1lYXN1cmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSBudW1iZXIgb2YgdGhpcyBtZWFzdXJlIGNoYW5nZWQsIHRoZW4gc2V0IHRoZSBudW1iZXJcbiAgICAgICAgLy8gb2YgdGhlIG5leHQgbWVhc3VyZSB0byB0aGlzIG9uZSArIDEgKHdoaWNoIHdpbGwgZ28gb24gYXNcbiAgICAgICAgLy8gbG9uZyBhcyB0aGVyZSdzIGEgbmV4dCBtZWFzdXJlKS5cbiAgICAgICAgaWYgKHRoaXMuaGFzQ2hhbmdlZCgnbnVtYmVyJykpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzKCduZXh0X21lYXN1cmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KCduZXh0X21lYXN1cmUnKS5zZXQoXG4gICAgICAgICAgICAgICAgICAgICdudW1iZXInLCB0aGlzLmdldCgnbnVtYmVyJykgKyAxXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgdXBkYXRlQmVhdFNjaGVtYTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIENoYW5nZXMgdGhlIGJlYXRzY2hlbWEgdG8gZ2l2ZW4gdmFsdWUgYW5kIHJlc2V0J3MgdGhlIGNob3Jkc1xuICAgICAgICAvLyBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgYmVhdF9zY2hlbWEuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEl0IHdpbGwgc2V0IHRoZSBjaG9yZHMnIGNvcnJlY3QgYmVhdHMgYW5kIHdpbGwgcmVtb3ZlXG4gICAgICAgIC8vIG92ZXJmbG93aW5nIGNob3JkcyBvciBhZGQgbWlzc2luZyBjaG9yZHMuXG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgYmVhdHNfc2V0ID0gdGhpcy5nZXQoJ2JlYXRfc2NoZW1hJykuc3BsaXQoJy0nKTtcbiAgICAgICAgdmFyIGxhc3RfY2hvcmQ7XG4gICAgICAgIHZhciBuZXdfY2hvcmQgPSBmYWxzZTtcbiAgICAgICAgdmFyIG5ld19jaG9yZHMgPSBbXTtcbiAgICAgICAgdmFyIG5ld19jaG9yZF92aWV3cyA9IFtdO1xuXG4gICAgICAgIF8uZWFjaChiZWF0c19zZXQsIGZ1bmN0aW9uKGJlYXRzLCBpbmRleCkge1xuXG4gICAgICAgICAgICB2YXIgY2hvcmQgPSB0aGF0LmdldCgnY2hvcmRzJykuYXQoaW5kZXgpO1xuXG4gICAgICAgICAgICBpZiAoIWNob3JkKSB7XG4gICAgICAgICAgICAgICAgY2hvcmQgPSBsYXN0X2Nob3JkLmNvcHkoKTtcbiAgICAgICAgICAgICAgICBuZXdfY2hvcmQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdfY2hvcmQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2hvcmQuc2V0KHtcbiAgICAgICAgICAgICAgICBiZWF0czogcGFyc2VJbnQoYmVhdHMpLFxuICAgICAgICAgICAgICAgIG51bWJlcjogaW5kZXggKyAxXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKG5ld19jaG9yZCkge1xuICAgICAgICAgICAgICAgIG5ld19jaG9yZHMucHVzaChjaG9yZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxhc3RfY2hvcmQgPSBjaG9yZDtcblxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobmV3X2Nob3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0KCdjaG9yZHMnKS5hZGQobmV3X2Nob3Jkcyk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICByZW5kZXJOZXh0TWVhc3VyZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5oYXMoJ25leHRfbWVhc3VyZScpICYmXG4gICAgICAgICAgICB0aGlzLmdldCgnbmV4dF9tZWFzdXJlJykuZ2V0KCdiZWF0X3NjaGVtYScpID09IFwiNFwiXG4gICAgICAgICkge1xuICAgICAgICAgICAgLy8gVHJpZ2dlciB0aGUgYHJlbmRlcigpYCBieSBzZXR0aW5nIHRpbWVzdGFtcCBpblxuICAgICAgICAgICAgLy8gbWlsbGlzZWNvbmRzIGluIGBjaGFuZ2VkYCBhdHRyaWJ1dGUuIFRoZW4gYHJlbmRlcigpYFxuICAgICAgICAgICAgLy8gd2lsbCBzaG93IG9yIHJlbW92ZSB0aGUgcmVwZWF0IHNpZ24gKCAlICkuXG4gICAgICAgICAgICB0aGlzLmdldCgnbmV4dF9tZWFzdXJlJykuZ2V0KCdjaG9yZHMnKS5maXJzdCgpXG4gICAgICAgICAgICAgICAgLnNldCgnY2hhbmdlZCcsIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHByZXZfbWVhc3VyZSA9IHRoaXMuZ2V0KCdwcmV2X21lYXN1cmUnKTtcbiAgICAgICAgdmFyIG5leHRfbWVhc3VyZSA9IHRoaXMuZ2V0KCduZXh0X21lYXN1cmUnKTtcblxuICAgICAgICBpZiAocHJldl9tZWFzdXJlKSB7XG5cbiAgICAgICAgICAgIGlmIChuZXh0X21lYXN1cmUpIHtcbiAgICAgICAgICAgICAgICBuZXh0X21lYXN1cmUuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgJ3ByZXZfbWVhc3VyZSc6IHByZXZfbWVhc3VyZSxcbiAgICAgICAgICAgICAgICAgICAgJ251bWJlcic6IHRoaXMuZ2V0KCdudW1iZXInKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByZXZfbWVhc3VyZS5zZXQoJ25leHRfbWVhc3VyZScsIG5leHRfbWVhc3VyZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByZXZfbWVhc3VyZS51bnNldCgnbmV4dF9tZWFzdXJlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChuZXh0X21lYXN1cmUpIHtcbiAgICAgICAgICAgIG5leHRfbWVhc3VyZS51bnNldCgncHJldl9tZWFzdXJlJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcblxuICAgIH0sXG5cbiAgICBjb3B5OiBmdW5jdGlvbihhdHRyaWJ1dGVzKSB7XG5cbiAgICAgICAgdmFyIGNvcHkgPSB0aGlzLmNsb25lKCk7XG4gICAgICAgIGNvcHkuc2V0KHtcbiAgICAgICAgICAgIGlkOiBudWxsLFxuICAgICAgICAgICAgY2hvcmRzOiB0aGlzLmdldCgnY2hvcmRzJykuY29weSh7IG1lYXN1cmU6IGNvcHkgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGNvcHkuc2V0KGF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29weS5pbml0TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgcmV0dXJuIGNvcHk7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVjdXJzaXZlbHkgc2F2ZXMgdGhpcyBtZWFzdXJlIGFuZCBpdCdzIGNoaWxkcmVuIChjaG9yZHMpLlxuICAgICAqL1xuICAgIHNhdmVSZWN1cnNpdmU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLnNhdmUobnVsbCwgeyBzdWNjZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoYXQuZ2V0KCdjaG9yZHMnKS51cmwgPSB0aGF0LmNob3Jkc1VybCgpO1xuICAgICAgICAgICAgdGhhdC5nZXQoJ2Nob3JkcycpLmVhY2goZnVuY3Rpb24oY2hvcmQpIHtcbiAgICAgICAgICAgICAgICBjaG9yZC5zYXZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfX0pO1xuXG4gICAgfSxcblxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBudW1iZXI6IHRoaXMuZ2V0KCdudW1iZXInKSxcbiAgICAgICAgICAgIGJlYXRfc2NoZW1hOiB0aGlzLmdldCgnYmVhdF9zY2hlbWEnKVxuICAgICAgICB9O1xuICAgIH1cblxufSk7XG4iLCJ2YXIgTGluZXMgPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9saW5lcy5qcycpO1xudmFyIGFsbEtleXMgPSByZXF1aXJlKCcuLi93aWRnZXRzL2FsbF9rZXlzLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaW5pdERhdGEoKTtcbiAgICAgICAgdGhpcy5pbml0TGlzdGVuZXJzKCk7XG4gICAgfSxcblxuICAgIGluaXREYXRhOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBPbmx5IHNldCBsaW5lcyBpZiBpdCBoYXNuJ3QgYmVlbiBzZXQgeWV0LiBQcmV2ZW50cyBlcnJvcnNcbiAgICAgICAgLy8gd2hlbiBjbG9uaW5nLlxuICAgICAgICBpZiAoISh0aGlzLmdldCgnbGluZXMnKSBpbnN0YW5jZW9mIEJhY2tib25lLkNvbGxlY3Rpb24pKSB7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IG5ldyBMaW5lcygpO1xuICAgICAgICAgICAgbGluZXMudXJsID0gdGhpcy5saW5lc1VybCgpO1xuXG4gICAgICAgICAgICBfLmVhY2godGhpcy5nZXQoJ2xpbmVzJyksIGZ1bmN0aW9uKGxpbmVfZGF0YSkge1xuICAgICAgICAgICAgICAgIGxpbmVfZGF0YS5zZWN0aW9uID0gdGhhdDtcbiAgICAgICAgICAgICAgICBsaW5lcy5hZGQobGluZV9kYXRhKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnNldCgnbGluZXMnLCBsaW5lcyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHRoaXMuZ2V0KCdrZXknKSBpbnN0YW5jZW9mIEJhY2tib25lLk1vZGVsKSkge1xuXG4gICAgICAgICAgICB0aGlzLnNldChcbiAgICAgICAgICAgICAgICAna2V5JyxcbiAgICAgICAgICAgICAgICBhbGxLZXlzLmZpbmRXaGVyZSh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmdldCgna2V5X2lkJylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgbGluZXNVcmw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy51cmwoKSArICcvbGluZXMnO1xuICAgIH0sXG5cbiAgICBpbml0TGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG9uLXNjcmVlbiBoZWlnaHQgb2YgdGhpcyBzZWN0aW9uLlxuICAgICAqL1xuICAgIGhlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLmdldCgnbGluZXMnKS5sZW5ndGggKlxuICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgIEdMT0JBTFMuc2V0dGluZ3MuYm94X2hlaWdodCArXG4gICAgICAgICAgICAgICAgR0xPQkFMUy5zZXR0aW5ncy5ib3JkZXJfd2lkdGhcbiAgICAgICAgICAgIClcbiAgICAgICAgKSArIEdMT0JBTFMuc2V0dGluZ3MuYm9yZGVyX3dpZHRoO1xuICAgIH0sXG5cbiAgICBjb3B5OiBmdW5jdGlvbihhdHRyaWJ1dGVzKSB7XG5cbiAgICAgICAgdmFyIGNvcHkgPSB0aGlzLmNsb25lKCk7XG4gICAgICAgIGNvcHkuc2V0KHtcbiAgICAgICAgICAgIGlkOiBudWxsLFxuICAgICAgICAgICAgbGluZXM6IHRoaXMuZ2V0KCdsaW5lcycpLmNvcHkoeyBzZWN0aW9uOiBjb3B5IH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBjb3B5LnNldChhdHRyaWJ1dGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvcHkuaW5pdExpc3RlbmVycygpO1xuXG4gICAgICAgIHJldHVybiBjb3B5O1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlY3Vyc2l2ZWx5IHNhdmVzIHRoaXMgc2VjdGlvbiBhbmQgaXQncyBjaGlsZHJlbiAobGluZXMsXG4gICAgICogbWVhc3VyZXMgYW5kIGNob3JkcykuXG4gICAgICovXG4gICAgc2F2ZVJlY3Vyc2l2ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuc2F2ZShudWxsLCB7IHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhhdC5nZXQoJ2xpbmVzJykudXJsID0gdGhhdC5saW5lc1VybCgpO1xuICAgICAgICAgICAgdGhhdC5nZXQoJ2xpbmVzJykuZWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgbGluZS5zYXZlUmVjdXJzaXZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfX0pO1xuXG4gICAgfSxcblxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBudW1iZXI6IHRoaXMuZ2V0KCdudW1iZXInKSxcbiAgICAgICAgICAgIGtleV9pZDogdGhpcy5nZXQoJ2tleScpLmdldCgnaWQnKSxcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLmdldCgndGl0bGUnKSxcbiAgICAgICAgICAgIHRpbWVfc2lnbmF0dXJlOiB0aGlzLmdldCgndGltZV9zaWduYXR1cmUnKSxcbiAgICAgICAgICAgIHNob3dfc2lkZWJhcjogdGhpcy5nZXQoJ3Nob3dfc2lkZWJhcicpXG4gICAgICAgIH07XG4gICAgfVxuXG59KTtcbiIsIi8qXG4gKiBNb2RlbCBzcGVjaWFsbHkgZm9yIHRoZSBBUEkgc3luYyB0aGF0IHVwZGF0ZXMgdGhlIHNlY3Rpb24nc1xuICoga2V5IHdpdGhvdXQgY2hhbmdpbmcgdGhlIGNob3Jkcy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuXG4gICAgdXJsOiBmdW5jdGlvbigpIHtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgR0xPQkFMUy5hcGlfcm9vdF91cmwgK1xuICAgICAgICAgICAgJ3NlY3Rpb24ta2V5LycgK1xuICAgICAgICAgICAgdGhpcy5nZXQoJ3NlY3Rpb24nKS5nZXQoJ2lkJykgKyAnLydcbiAgICAgICAgKTtcblxuICAgIH0sXG5cbiAgICBpc05ldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmdldCgnc2VjdGlvbicpLmdldCgna2V5Jyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvbmljOiBrZXkuZ2V0KCd0b25pYycpLFxuICAgICAgICAgICAgdG9uYWxpdHk6IGtleS5nZXQoJ3RvbmFsaXR5JylcbiAgICAgICAgfTtcblxuICAgIH1cblxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cbiAgICBkZWZhdWx0czoge1xuICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICB1cmw6IChcbiAgICAgICAgR0xPQkFMUy5hcGlfcm9vdF91cmwgK1xuICAgICAgICAnY2hhcnQtc29uZy1uYW1lLycgK1xuICAgICAgICBHTE9CQUxTLmNoYXJ0X2RhdGEuaWQgKyAnLydcbiAgICApLFxuXG4gICAgaXNOZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdG9KU09OOiBmdW5jdGlvbigpIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc29uZ19uYW1lOiB0aGlzLmdldCgnc29uZ19uYW1lJyksXG4gICAgICAgIH07XG5cbiAgICB9XG5cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfVxufSk7XG4iLCJ2YXIgTGluZXMgPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9saW5lcy5qcycpO1xudmFyIE1lYXN1cmVzID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvbWVhc3VyZXMuanMnKTtcbnZhciBDaGFydCA9IHJlcXVpcmUoJy4uL21vZGVscy9jaGFydC5qcycpO1xudmFyIFNlY3Rpb25WaWV3ID0gcmVxdWlyZSgnLi9zZWN0aW9uLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgICBjbGFzc05hbWU6ICdjaGFydCcsXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIC5zZWN0aW9uLW5ldyc6ICdjcmVhdGVOZXdTZWN0aW9uJyxcbiAgICB9LFxuXG4gICAgY3JlYXRlTmV3U2VjdGlvbjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGxhc3Rfc2VjdGlvbiA9IHRoaXMubW9kZWwuZ2V0KCdzZWN0aW9ucycpLmxhc3QoKTtcblxuICAgICAgICB2YXIgbmV3X3NlY3Rpb24gPSBsYXN0X3NlY3Rpb24uY29weSh7XG4gICAgICAgICAgICBudW1iZXI6IGxhc3Rfc2VjdGlvbi5nZXQoJ251bWJlcicpICsgMSxcbiAgICAgICAgICAgIGFsdF9uYW1lOiAnJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIG5ld19saW5lID0gbmV3X3NlY3Rpb24uZ2V0KCdsaW5lcycpLmZpcnN0KCkuY29weSgpO1xuICAgICAgICB2YXIgbmV3X21lYXN1cmUgPSBuZXdfbGluZS5nZXQoJ21lYXN1cmVzJykuZmlyc3QoKS5jb3B5KHtcbiAgICAgICAgICAgIG5leHRfbWVhc3VyZTogbnVsbCxcbiAgICAgICAgICAgIHByZXZfbWVhc3VyZTogbnVsbFxuICAgICAgICB9KTtcblxuICAgICAgICBuZXdfbGluZS5nZXQoJ21lYXN1cmVzJykucmVzZXQoW25ld19tZWFzdXJlXSk7XG4gICAgICAgIG5ld19zZWN0aW9uLmdldCgnbGluZXMnKS5yZXNldChbbmV3X2xpbmVdKTtcblxuICAgICAgICB2YXIgc2VjdGlvbnMgPSB0aGlzLm1vZGVsLmdldCgnc2VjdGlvbnMnKTtcbiAgICAgICAgc2VjdGlvbnMuYWRkKG5ld19zZWN0aW9uKTtcblxuICAgICAgICBpZiAoc2VjdGlvbnMuc2l6ZSgpID09IDIpIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIHNlY29uZCBzZWN0aW9uLCBpdCBtZWFucyB0aGUgZmlyc3RcbiAgICAgICAgICAgIC8vIHNlY3Rpb24gc2hvdWxkIG5vdyBnZXQgbW92ZSBhbmQgcmVtb3ZlIGJ1dHRvbnMuXG4gICAgICAgICAgICAvLyBTbyB3ZSB0cmlnZ2VyIGEgJ2NoYW5nZScgZXZlbnQgc28gdGhhdCBpdCB3aWxsXG4gICAgICAgICAgICAvLyByZXJlbmRlciBpdHNlbGYuXG4gICAgICAgICAgICBzZWN0aW9ucy5maXJzdCgpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlY3Rpb25WaWV3ID0gbmV3IFNlY3Rpb25WaWV3KHtcbiAgICAgICAgICAgIG1vZGVsOiBuZXdfc2VjdGlvblxuICAgICAgICB9KTtcblxuICAgICAgICBzZWN0aW9uVmlldy5yZW5kZXIoKS4kZWwuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLnNlY3Rpb24tbmV3JylcbiAgICAgICAgKTtcblxuICAgICAgICBuZXdfc2VjdGlvbi5zYXZlUmVjdXJzaXZlKCk7XG5cbiAgICB9XG5cbn0pO1xuIiwidmFyIENob3JkID0gcmVxdWlyZSgnLi4vbW9kZWxzL2Nob3JkLmpzJyk7XG52YXIgY2hvcmRFZGl0ID0gcmVxdWlyZSgnLi4vaW5pdC9jaG9yZF9lZGl0LmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgICBtb2RlbDogQ2hvcmQsXG4gICAgY2xhc3NOYW1lOiAnY2hvcmQnLFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZScsIHRoaXMucmVuZGVyKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayAuY2hvcmQtbmFtZSc6ICdvcGVuQ2hvcmRFZGl0J1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBPcGVucyB0aGUgZWRpdCB3aWRnZXQgZm9yIHRoaXMgY2hvcmRcbiAgICAgKi9cbiAgICBvcGVuQ2hvcmRFZGl0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAoIUdMT0JBTFMuZWRpdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIGNob3JkIGVkaXQgd2lkZ2V0IGlzIGFscmVhZHkgb3BlbiBmb3IgdGhpcyBjaG9yZCB0aGVuXG4gICAgICAgIC8vIGNsb3NlIGl0LCBvdGhlcndpc2Ugb3BlbiBpdC5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgY2hvcmRFZGl0LmdldCgndmlzaWJsZScpICYmXG4gICAgICAgICAgICBjaG9yZEVkaXQuZ2V0KCdjaG9yZCcpID09IHRoaXMubW9kZWxcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBjaG9yZEVkaXQuc2V0KCd2aXNpYmxlJywgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hvcmRFZGl0LnNldCh7XG4gICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjaG9yZDogdGhpcy5tb2RlbCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMuJGVsLm9mZnNldCgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLm1vZGVsLmdldCgnbWVhc3VyZScpKSB7XG4gICAgICAgICAgICAvLyBvbmx5IHBhcnNlIG5leHQgbWVhc3VyZSBpZiB3aG9sZSBjaGFydCBoYXMgYmVlbiBkb25lIHBhcnNpbmdcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjaG9yZC0nICsgdGhpcy5tb2RlbC5nZXQoJ251bWJlcicpKTtcblxuICAgICAgICB2YXIgZm9udF9zaXplO1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGVsLmdldCgncmVzdCcpKSB7XG4gICAgICAgICAgICBmb250X3NpemUgPSAndGlueSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb250X3NpemUgPSAnbm9ybWFsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGVsLmh0bWwoXG4gICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjaG9yZC1uYW1lIGZvbnQtc2l6ZS0nICsgZm9udF9zaXplICsgJ1wiPicgKyBcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmNoYXJ0T3V0cHV0KCkgK1xuICAgICAgICAgICAgJzwvc3Bhbj4nXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9LFxuXG59KTtcbiIsInZhciBDaG9yZEVkaXROb3RlcyA9IHJlcXVpcmUoJy4uL2NvbGxlY3Rpb25zL2Nob3JkX2VkaXRfbm90ZXMuanMnKTtcbnZhciBDaG9yZEVkaXRDaG9yZFR5cGVzID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvY2hvcmRfZWRpdF9jaG9yZF90eXBlcy5qcycpO1xudmFyIENob3JkRWRpdCA9IHJlcXVpcmUoJy4uL21vZGVscy9jaG9yZF9lZGl0LmpzJyk7XG52YXIgQ2hvcmRFZGl0Tm90ZSA9IHJlcXVpcmUoJy4uL21vZGVscy9jaG9yZF9lZGl0X25vdGUuanMnKTtcbnZhciBjaG9yZFR5cGVzID0gcmVxdWlyZSgnLi4vaW5pdC9jaG9yZF90eXBlcy5qcycpO1xudmFyIGFsbEtleXMgPSByZXF1aXJlKCcuLi93aWRnZXRzL2FsbF9rZXlzLmpzJyk7XG52YXIgQ2hvcmRFZGl0Tm90ZVZpZXcgPSByZXF1aXJlKCcuL2Nob3JkX2VkaXRfbm90ZS5qcycpO1xudmFyIENob3JkRWRpdENob3JkVHlwZVZpZXcgPSByZXF1aXJlKCcuL2Nob3JkX2VkaXRfY2hvcmRfdHlwZS5qcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gICAgbW9kZWw6IENob3JkRWRpdCxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgaGVhZGVyIC5jbG9zZSc6ICdjbG9zZScsXG4gICAgICAgICdjbGljayAudGFicyBsaSc6ICdzd2l0Y2hUYWInLFxuICAgICAgICAnY2xpY2sgLmNob3JkLXNldHRpbmdzIC5zZXR0aW5nLm5vdGUgLnJlc3QnOiAndXNlQXNSZXN0JyxcbiAgICAgICAgJ2NsaWNrIC5jaG9yZC1zZXR0aW5ncyAuc2V0dGluZy50eXBlIC50b2dnbGUnOiAndG9nZ2xlQ2hvcmRUeXBlcycsXG4gICAgICAgICdjbGljayAuY2hvcmQtc2V0dGluZ3MgLnNldHRpbmcuYWx0LWJhc3Mtbm90ZSAubm9uZSc6ICdub0FsdEJhc3MnXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNob3JkX3R5cGVfZWwgPSB0aGlzLiRlbC5maW5kKCcuY2hvcmQtc2V0dGluZ3MgLnNldHRpbmcudHlwZScpO1xuICAgICAgICB0aGlzLmluaXRDaG9yZFR5cGVzKCk7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZScsIHRoaXMucmVuZGVyKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBPbmx5IHNob3cgdGhlIGVkaXQgd2lkZ2V0IHdoZW4gJ3Zpc2libGUnIGlzIHRydWUsXG4gICAgICAgIC8vIG90aGVyd2lzZSwgaGlkZSB0aGUgZWRpdCB3aWRnZXQuXG5cbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCd2aXNpYmxlJykpIHtcblxuICAgICAgICAgICAgdmFyIHByZXZpb3VzQXR0cmlidXRlcyA9IHRoaXMubW9kZWwucHJldmlvdXNBdHRyaWJ1dGVzKCk7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBlZGl0IHdpZGdldCB3YXMgYWxyZWFkeSBvcGVuIGZvciB0aGlzIGNob3JkLFxuICAgICAgICAgICAgLy8gdGhlbiBhcHBhcmVudGx5IHNvbWV0aGluZyBlbHNlIHRoYW4gdGhlIHZpc2liaWxpdHlcbiAgICAgICAgICAgIC8vIGNoYW5nZWQsIHNvIHdlIGFwcGx5IHRoZSBjaGFuZ2VzLlxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHByZXZpb3VzQXR0cmlidXRlcy52aXNpYmxlICYmXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ2Nob3JkJykgPT0gcHJldmlvdXNBdHRyaWJ1dGVzLmNob3JkXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5Q2hhbmdlcygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNob3coKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZWwuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9LFxuXG4gICAgaW5pdENob3JkVHlwZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBDcmVhdGVzIHRoZSB2aWV3cyBmb3IgdGhlIGNob3JkIHR5cGUgY2hvaWNlcyBhbmQgYmluZHMgdGhlbSB0b1xuICAgICAgICAvLyB0aGUgZXhpc3RpbmcgSFRNTFxuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5jaG9yZEVkaXRDaG9yZFR5cGVzID0gbmV3IENob3JkRWRpdENob3JkVHlwZXMoKTtcblxuICAgICAgICBjaG9yZFR5cGVzLmVhY2goZnVuY3Rpb24oY2hvcmRfdHlwZSkge1xuICAgICAgICAgICAgdGhhdC5jaG9yZEVkaXRDaG9yZFR5cGVzLmFkZCh7XG4gICAgICAgICAgICAgICAgY2hvcmRfdHlwZTogY2hvcmRfdHlwZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBudW1iZXIgPSAwO1xuICAgICAgICB2YXIgY2hvcmRFZGl0Q2hvcmRUeXBlO1xuXG4gICAgICAgIHRoaXMuY2hvcmRfdHlwZV9lbC5maW5kKCdsaScpLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNob3JkRWRpdENob3JkVHlwZSA9IHRoYXQuY2hvcmRFZGl0Q2hvcmRUeXBlcy5tb2RlbHNbbnVtYmVyXTtcbiAgICAgICAgICAgIGNob3JkRWRpdENob3JkVHlwZS5zZXQoJ2VkaXRXaWRnZXQnLCB0aGF0Lm1vZGVsKTtcblxuICAgICAgICAgICAgbmV3IENob3JkRWRpdENob3JkVHlwZVZpZXcoe1xuICAgICAgICAgICAgICAgIGVsOiB0aGlzLFxuICAgICAgICAgICAgICAgIG1vZGVsOiBjaG9yZEVkaXRDaG9yZFR5cGVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBudW1iZXIrKztcblxuICAgICAgICB9KTtcblxuICAgIH0sXG5cbiAgICBhcHBseUNoYW5nZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBBcHBsaWVzIHRoZSBjaGFuZ2VzIG1hZGUgaW4gdGhlIGVkaXQgd2lkZ2V0IHRvIHRoZSBjaG9yZFxuXG4gICAgICAgIHZhciBub3RlID0gQm9vbGVhbih0aGlzLm1vZGVsLmdldCgnbm90ZScpKTtcbiAgICAgICAgdmFyIGFsdF9iYXNzID0gQm9vbGVhbih0aGlzLm1vZGVsLmdldCgnYWx0X2Jhc3Nfbm90ZScpKTtcblxuICAgICAgICB2YXIgY2hvcmRfZGF0YSA9IHtcbiAgICAgICAgICAgIGNob3JkX3R5cGVfaWQ6IHRoaXMubW9kZWwuZ2V0KCdjaG9yZF90eXBlJykuZ2V0KCdpZCcpLFxuICAgICAgICAgICAgYWx0X2Jhc3M6IGFsdF9iYXNzLFxuICAgICAgICAgICAgcmVzdDogIW5vdGVcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAobm90ZSkge1xuICAgICAgICAgICAgY2hvcmRfZGF0YS5jaG9yZF9waXRjaCA9IHRoaXMubW9kZWwuZ2V0KCdub3RlJykuZ2V0KFxuICAgICAgICAgICAgICAgICdkaXN0YW5jZV9mcm9tX3Jvb3QnXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFsdF9iYXNzKSB7XG4gICAgICAgICAgICBjaG9yZF9kYXRhLmFsdF9iYXNzX25vdGUgPSB0aGlzLm1vZGVsLmdldCgnYWx0X2Jhc3Nfbm90ZScpO1xuICAgICAgICAgICAgY2hvcmRfZGF0YS5hbHRfYmFzc19waXRjaCA9IChcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgnYWx0X2Jhc3Nfbm90ZScpLmdldCgnZGlzdGFuY2VfZnJvbV9yb290JylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaG9yZF9kYXRhLmFsdF9iYXNzX25vdGUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW9kZWwuZ2V0KCdjaG9yZCcpLnNldChjaG9yZF9kYXRhKTtcbiAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ2Nob3JkJykuc2F2ZSgpO1xuXG4gICAgfSxcblxuICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3Zpc2libGUnLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIHN3aXRjaFRhYjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIC8vIFN3aXRjaGVzIHRvIGEgdGFiIGluIHRoZSBlZGl0IHdpZGdldFxuICAgICAgICAvLyBsaWtlICdub3RlJywgJ3R5cGUnIGFuZCAnYWx0X2Jhc3NfYmFzcydcblxuICAgICAgICB2YXIgdGFiID0gJChvYmouY3VycmVudFRhcmdldCk7XG4gICAgICAgIHRoaXMub3BlblRhYih0YWIuZGF0YSgna2V5JykpO1xuXG4gICAgfSxcblxuICAgIG9wZW5UYWI6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAvLyBPcGVucyB0YWIgbWF0Y2hpbmcgcHJvdmlkZWQga2V5XG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnRhYnMgbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgIC5wYXJlbnQoKS5maW5kKCdsaVtkYXRhLWtleT0nICsga2V5ICsgJ10nKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcuY2hvcmQtc2V0dGluZ3MgLnNldHRpbmcnKS5oaWRlKCkucGFyZW50KCkuZmluZChcbiAgICAgICAgICAgICcuc2V0dGluZ1tkYXRhLWtleT0nICsga2V5ICsgJ10nXG4gICAgICAgICkuc2hvdygpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhpcyBjaG9yZCB0byBiZSB1c2VkIGFzIGEgcmVzdC5cbiAgICAgKi9cbiAgICB1c2VBc1Jlc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm1vZGVsLnNldCgnbm90ZScsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlcyBiZXR3ZWVuIHRoZSB0d28gcGFnZXMgb2YgY2hvcmQgdHlwZSBvcHRpb25zXG4gICAgICovXG4gICAgdG9nZ2xlQ2hvcmRUeXBlczogZnVuY3Rpb24ob2JqKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY2hvcmRfdHlwZV9lbC5maW5kKCcudHlwZS1wYXJ0LTEnKS5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgdGhpcy5zaG93Q2hvcmRUeXBlUGFydCgyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Nob3JkVHlwZVBhcnQoMSk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBub0FsdEJhc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm1vZGVsLnNldCgnYWx0X2Jhc3Nfbm90ZScsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgc2hvd0Nob3JkVHlwZVBhcnQ6IGZ1bmN0aW9uKG51bWJlcikge1xuICAgICAgICAvLyBTaG93cyB0aGUgY2hvcmQgdHlwZSBwYXJ0IG9mIHRoZSBwcm92aWRlZCBudW1iZXJcbiAgICAgICAgLy8gVGhlIGNob3JkIHR5cGUgY2hvaWNlcyBhcmUgaW4gdGhlc2UgcGFydHNcbiAgICAgICAgdGhpcy5jaG9yZF90eXBlX2VsLmZpbmQoJy50eXBlLXBhcnQnKS5oaWRlKCk7XG4gICAgICAgIHRoaXMuY2hvcmRfdHlwZV9lbC5maW5kKCcudHlwZS1wYXJ0LScgKyBudW1iZXIpLnNob3coKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUGFyc2VzIHRoZSBzZXR0aW5ncyBvbiB0aGUgbW9kZWwgYW5kIHJlbmRlciB0aGUgaHRtbFxuICAgICAqIGFjY29yZGluZ2x5LlxuICAgICAqL1xuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIElmIHRoZSBlZGl0IHdpZGdldCBvcGVucyBvbiBhIGRpZmZlcmVudCBjaG9yZCB0aGFuIHRoZVxuICAgICAgICAvLyBsYXN0IG9uZSwgdGhlbiByZXNldCB0aGUgZWRpdFdpZGdldC5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5tb2RlbC5wcmV2aW91c0F0dHJpYnV0ZXMoKS5jaG9yZCAhPVxuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ2Nob3JkJylcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5vZmZzZXQoKTtcblxuICAgICAgICB0aGlzLiRlbC5jc3Moe1xuICAgICAgICAgICAgJ3RvcCc6IHRoaXMubW9kZWwuZ2V0KCdvZmZzZXQnKS50b3AgKyBvZmZzZXQudG9wLFxuICAgICAgICAgICAgJ2xlZnQnOiB0aGlzLm1vZGVsLmdldCgnb2Zmc2V0JykubGVmdCArIG9mZnNldC5sZWZ0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucGFyc2VOb3RlcygpO1xuICAgICAgICB0aGlzLnBhcnNlQ2hvcmRUeXBlcygpO1xuXG4gICAgICAgIHRoaXMuJGVsLnNob3coKTtcblxuICAgIH0sXG5cbiAgICBvZmZzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBHZXQgdGhlIG9mZnNldCBmb3IgdGhlIGVkaXQgd2lkZ2V0IGJhc2VkIG9uIHRoZSBjaG9yZCBpdCB3YXNcbiAgICAgICAgLy8gb3BlbmVkIGZvci5cblxuICAgICAgICB2YXIgYmVhdF9zY2hlbWEgPSB0aGlzLm1vZGVsLmdldCgnY2hvcmQnKVxuICAgICAgICAgICAgLmdldCgnbWVhc3VyZScpLmdldCgnYmVhdF9zY2hlbWEnKTtcblxuICAgICAgICB2YXIgb2ZmX3RvcDtcbiAgICAgICAgdmFyIG9mZl9sZWZ0O1xuXG4gICAgICAgIHN3aXRjaChiZWF0X3NjaGVtYSkge1xuXG4gICAgICAgICAgICBjYXNlICc0JzpcbiAgICAgICAgICAgICAgICBvZmZfdG9wID0gODU7XG4gICAgICAgICAgICAgICAgb2ZmX2xlZnQgPSAtMTA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJzItMic6XG4gICAgICAgICAgICAgICAgb2ZmX3RvcCA9IDYwO1xuICAgICAgICAgICAgICAgIG9mZl9sZWZ0ID0gLTI5O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICcyLTEtMSc6XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2godGhpcy5tb2RlbC5nZXQoJ2Nob3JkJykuZ2V0KCdudW1iZXInKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl90b3AgPSA2MDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl9sZWZ0ID0gLTI5O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgb2ZmX3RvcCA9IDQ3O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2ZmX2xlZnQgPSAtOTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl90b3AgPSA3NztcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl9sZWZ0ID0gLTM5O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnMS0xLTInOlxuXG4gICAgICAgICAgICAgICAgc3dpdGNoKHRoaXMubW9kZWwuZ2V0KCdjaG9yZCcpLmdldCgnbnVtYmVyJykpIHtcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfdG9wID0gNzc7XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfbGVmdCA9IC0zOTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl90b3AgPSA0NztcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl9sZWZ0ID0gLTk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfdG9wID0gNjA7XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfbGVmdCA9IC0yOTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJzEtMS0xLTEnOlxuXG4gICAgICAgICAgICAgICAgc3dpdGNoKHRoaXMubW9kZWwuZ2V0KCdjaG9yZCcpLmdldCgnbnVtYmVyJykpIHtcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfdG9wID0gNzc7XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfbGVmdCA9IC0zOTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl90b3AgPSA0NztcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl9sZWZ0ID0gLTk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfdG9wID0gNDc7XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfbGVmdCA9IC05O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgb2ZmX3RvcCA9IDc3O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2ZmX2xlZnQgPSAtMzk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBvZmZfdG9wLFxuICAgICAgICAgICAgbGVmdDogb2ZmX2xlZnRcbiAgICAgICAgfTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQYXJzZXMgdGhlIG5vdGUgYW5kIHRoZSBhbHQgYmFzcyBub3RlIGNob2ljZXMuXG4gICAgICovXG4gICAgcGFyc2VOb3RlczogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgbm90ZV90eXBlcyA9IFsnbm90ZScsICdhbHRfYmFzc19ub3RlJ107XG5cbiAgICAgICAgLy8gSWYgdGhlIG5vdGVzIGFyZSBkaWZmZXJlbnQgZnJvbSB0aGUgbGFzdCB0aW1lLCByZWdlbmVyYXRlXG4gICAgICAgIC8vIHRoZSBtb2RlbHMvdmlld3MuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdub3RlX2Nob2ljZXMnKSAhPVxuICAgICAgICAgICAgdGhpcy5tb2RlbC5wcmV2aW91c0F0dHJpYnV0ZXMoKS5ub3RlX2Nob2ljZXNcbiAgICAgICAgKSB7XG5cbiAgICAgICAgICAgIHRoYXQuZWRpdFdpZGdldE5vdGVzID0gW107XG5cbiAgICAgICAgICAgIF8uZWFjaChub3RlX3R5cGVzLCBmdW5jdGlvbihub3RlX3R5cGUpIHtcblxuICAgICAgICAgICAgICAgIHRoYXQuZWRpdFdpZGdldE5vdGVzW25vdGVfdHlwZV0gPSBuZXcgQ2hvcmRFZGl0Tm90ZXMoKTtcbiAgICAgICAgICAgICAgICB2YXIgZWRpdFdpZGdldE5vdGU7XG4gICAgICAgICAgICAgICAgdmFyIG5vdGVfY2hvaWNlcyA9IHRoYXQuJGVsLmZpbmQoXG4gICAgICAgICAgICAgICAgICAgICcuY2hvcmQtc2V0dGluZ3MgJyArXG4gICAgICAgICAgICAgICAgICAgICcuc2V0dGluZ1tkYXRhLWtleT0nICsgbm90ZV90eXBlICsgJ10gdWwnXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBub3RlX2Nob2ljZXMuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgICAgICB0aGF0Lm1vZGVsLmdldCgnbm90ZV9jaG9pY2VzJykuZWFjaChmdW5jdGlvbihub3RlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZWRpdFdpZGdldE5vdGUgPSBuZXcgQ2hvcmRFZGl0Tm90ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlX2lkOiBub3RlLmdldCgnaWQnKSwgLy8gdXNlZCBmb3IgYGZpbmRXaGVyZWAgbGF0ZXIgb25cbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGU6IG5vdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlX3R5cGU6IG5vdGVfdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRXaWRnZXQ6IHRoYXQubW9kZWxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhhdC5lZGl0V2lkZ2V0Tm90ZXNbbm90ZV90eXBlXS5hZGQoZWRpdFdpZGdldE5vdGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIG5vdGVfY2hvaWNlcy5hcHBlbmQoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgQ2hvcmRFZGl0Tm90ZVZpZXcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiBlZGl0V2lkZ2V0Tm90ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkucmVuZGVyKCkuZWxcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VsZWN0IHRoZSBjb3JyZWN0IG5vdGVcbiAgICAgICAgXy5lYWNoKG5vdGVfdHlwZXMsIGZ1bmN0aW9uKG5vdGVfdHlwZSkge1xuXG4gICAgICAgICAgICAvLyBEZXNlbGVjdCBsYXN0IHNlbGVjdGVkIGlmIGl0IGV4aXN0c1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRfc2VsZWN0ZWQgPSAoXG4gICAgICAgICAgICAgICAgdGhhdC5lZGl0V2lkZ2V0Tm90ZXNbbm90ZV90eXBlXVxuICAgICAgICAgICAgICAgIC5maW5kV2hlcmUoeyBzZWxlY3RlZDogdHJ1ZSB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRfc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50X3NlbGVjdGVkLnNldCgnc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlbGVjdCBub3RlIGlmIGl0IGlzIHNldCAoYmFzcyBub3RlIGRvZXNuJ3QgaGF2ZSB0byBiZVxuICAgICAgICAgICAgLy8gc2V0KVxuXG4gICAgICAgICAgICB2YXIgZGVzZWxlY3RfYnV0dG9uID0gdGhhdC4kZWwuZmluZChcbiAgICAgICAgICAgICAgICAnLmNob3JkLXNldHRpbmdzICcgK1xuICAgICAgICAgICAgICAgICcuc2V0dGluZ1tkYXRhLWtleT0nICsgbm90ZV90eXBlICsgJ10gLmRlc2VsZWN0J1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKHRoYXQubW9kZWwuZ2V0KG5vdGVfdHlwZSkpIHtcblxuICAgICAgICAgICAgICAgIGlmIChkZXNlbGVjdF9idXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzZWxlY3RfYnV0dG9uLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoYXQuZWRpdFdpZGdldE5vdGVzW25vdGVfdHlwZV0uZmluZFdoZXJlKHtcbiAgICAgICAgICAgICAgICAgICAgbm90ZV9pZDogdGhhdC5tb2RlbC5nZXQobm90ZV90eXBlKS5pZFxuICAgICAgICAgICAgICAgIH0pLnNldCgnc2VsZWN0ZWQnLCB0cnVlKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXNlbGVjdF9idXR0b24pIHtcbiAgICAgICAgICAgICAgICBkZXNlbGVjdF9idXR0b24uYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9LFxuXG4gICAgcGFyc2VDaG9yZFR5cGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gU2VsZWN0IHRoZSBjb3JyZWN0IGNob3JkIHR5cGVcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciBjdXJyZW50X3NlbGVjdGVkID0gdGhpcy5jaG9yZEVkaXRDaG9yZFR5cGVzLmZpbmRXaGVyZSh7XG4gICAgICAgICAgICBzZWxlY3RlZDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY3VycmVudF9zZWxlY3RlZCkge1xuICAgICAgICAgICAgY3VycmVudF9zZWxlY3RlZC5zZXQoJ3NlbGVjdGVkJywgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaG9yZEVkaXRDaG9yZFR5cGVzLmZpbmQoZnVuY3Rpb24oY2hvcmRFZGl0Q2hvcmRUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIGNob3JkRWRpdENob3JkVHlwZS5nZXQoJ2Nob3JkX3R5cGUnKS5nZXQoJ2lkJykgPT1cbiAgICAgICAgICAgICAgICB0aGF0Lm1vZGVsLmdldCgnY2hvcmRfdHlwZScpLmdldCgnaWQnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSkuc2V0KCdzZWxlY3RlZCcsIHRydWUpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgZWRpdCB3aWRnZXQgdG8gdGhlIFwic3RhcnQgc3RhdGVcIi5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlLCB0aGUgY2hvc2VuIGNob3JkIGlzIHRoZSBjaG9yZCB0aGUgZWRpdCBpcyBvbiBhbmRcbiAgICAgKiB0aGUgc2VsZWN0ZWQgdGFiIGlzIHRoZSBub3RlIHRhYi5cbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGNob3JkID0gdGhpcy5tb2RlbC5nZXQoJ2Nob3JkJyk7XG4gICAgICAgIHZhciByZXN0ID0gY2hvcmQuZ2V0KCdyZXN0Jyk7XG4gICAgICAgIHZhciBub3RlO1xuXG4gICAgICAgIGlmIChyZXN0KSB7XG4gICAgICAgICAgICBub3RlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub3RlID0gY2hvcmQuZ2V0KCdub3RlJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICBub3RlOiBub3RlLFxuICAgICAgICAgICAgY2hvcmRfdHlwZTogY2hvcmQuZ2V0KCdjaG9yZF90eXBlJyksXG4gICAgICAgICAgICBhbHRfYmFzczogY2hvcmQuZ2V0KCdhbHRfYmFzcycpLFxuICAgICAgICAgICAgYWx0X2Jhc3Nfbm90ZTogY2hvcmQuZ2V0KCdhbHRfYmFzc19ub3RlJyksXG4gICAgICAgICAgICByZXN0OiByZXN0LFxuICAgICAgICAgICAgbm90ZV9jaG9pY2VzOiAoXG4gICAgICAgICAgICAgICAgYWxsS2V5cy5maW5kV2hlcmUoe1xuICAgICAgICAgICAgICAgICAgICBpZDogY2hvcmQuZ2V0KCdrZXlfaWQnKVxuICAgICAgICAgICAgICAgIH0pLmdldCgnbm90ZXMnKVxuICAgICAgICAgICAgKVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTaG93IHRoZSBjaG9yZCB0eXBlIHBhcnQgdGhhdCBoYXMgdGhlIGN1cmVudCBzZWxlY3RlZCBjaG9yZFxuICAgICAgICAvLyB0eXBlLlxuICAgICAgICB2YXIgY3VycmVudF9jaG9yZF90eXBlID0gdGhpcy5jaG9yZEVkaXRDaG9yZFR5cGVzLmZpbmRXaGVyZSh7XG4gICAgICAgICAgICBjaG9yZF90eXBlOiB0aGlzLm1vZGVsLmdldCgnY2hvcmRfdHlwZScpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmNob3JkRWRpdENob3JkVHlwZXMuaW5kZXhPZihjdXJyZW50X2Nob3JkX3R5cGUpID4gMTEpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Nob3JkVHlwZVBhcnQoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNob3dDaG9yZFR5cGVQYXJ0KDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcGVuVGFiKCdub3RlJyk7XG5cbiAgICB9XG5cbn0pO1xuIiwidmFyIENob3JkRWRpdENob3JkVHlwZSA9IHJlcXVpcmUoJy4uL21vZGVscy9jaG9yZF9lZGl0X2Nob3JkX3R5cGUuanMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICAgIG1vZGVsOiBDaG9yZEVkaXRDaG9yZFR5cGUsXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCAnY2hhbmdlJywgdGhpcy5yZW5kZXIpO1xuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrJzogJ2Nob29zZVN5bWJvbCdcbiAgICB9LFxuXG4gICAgY2hvb3NlU3ltYm9sOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ2VkaXRXaWRnZXQnKS5zZXQoXG4gICAgICAgICAgICAnY2hvcmRfdHlwZScsXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgnY2hvcmRfdHlwZScpXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLm1vZGVsLmdldCgnc3ltYm9sJykpO1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGVsLmdldCgnc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KTtcbiIsInZhciBDaG9yZEVkaXROb3RlID0gcmVxdWlyZSgnLi4vbW9kZWxzL2Nob3JkX2VkaXRfbm90ZS5qcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gICAgdGFnTmFtZTogJ2xpJyxcbiAgICBtb2RlbDogQ2hvcmRFZGl0Tm90ZSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlcik7XG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2snOiAnY2hvb3NlTm90ZSdcbiAgICB9LFxuXG4gICAgY2hvb3NlTm90ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFNldHMgdGhlIGNob3NlbiBub3RlIG9uIHRoZSBlZGl0V2lkZ2V0XG4gICAgICAgIHRoaXMubW9kZWwuZ2V0KCdlZGl0V2lkZ2V0Jykuc2V0KFxuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ25vdGVfdHlwZScpLFxuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ25vdGUnKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB0aGlzLiRlbC5odG1sKHRoaXMubW9kZWwuZ2V0KCdub3RlJykuZ2V0KCduYW1lJykpO1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGVsLmdldCgnc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG59KTtcbiIsInZhciBNZWFzdXJlVmlldyA9IHJlcXVpcmUoJy4vbWVhc3VyZS5qcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gICAgdGFnTmFtZTogJ3RyJyxcbiAgICBjbGFzc05hbWU6ICdsaW5lJyxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwuZ2V0KCdtZWFzdXJlcycpLCAnYWRkJywgdGhpcy5tZWFzdXJlQWRkZWQpO1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwuZ2V0KCdtZWFzdXJlcycpLCAncmVtb3ZlJywgdGhpcy5tZWFzdXJlUmVtb3ZlZCk7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2Rlc3Ryb3knLCB0aGlzLnJlbW92ZSk7XG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgLm1lYXN1cmUtYWRkIC5wbHVzJzogJ2FkZE1lYXN1cmUnXG4gICAgfSxcblxuICAgIG1lYXN1cmVBZGRlZDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdtZWFzdXJlcycpLmxlbmd0aCA8IDgpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jb2xzcGFuJykucHJvcChcbiAgICAgICAgICAgICAgICAnY29sc3BhbicsXG4gICAgICAgICAgICAgICAgOCAtIHRoaXMubW9kZWwuZ2V0KCdtZWFzdXJlcycpLmxlbmd0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5tZWFzdXJlLWFkZCcpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgbWVhc3VyZVJlbW92ZWQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGVsLmdldCgnbWVhc3VyZXMnKS5sZW5ndGggPT0gNykge1xuICAgICAgICAgICAgdGhpcy5hZGRNZWFzdXJlQWRkV2lkZ2V0KDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLmNvbHNwYW4nKS5wcm9wKFxuICAgICAgICAgICAgICAgICdjb2xzcGFuJyxcbiAgICAgICAgICAgICAgICA4IC0gdGhpcy5tb2RlbC5nZXQoJ21lYXN1cmVzJykubGVuZ3RoXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgYWRkTWVhc3VyZUFkZFdpZGdldDogZnVuY3Rpb24oY29sc3Bhbikge1xuICAgICAgICB0aGlzLiRlbC5hcHBlbmQoXG4gICAgICAgICAgICAnPHRkIGNsYXNzPVwibWVhc3VyZS1hZGQgY29sc3BhblwiIGNvbHNwYW49XCInICsgY29sc3BhbiArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBsdXNcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAnPC90ZD4nXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIGFkZE1lYXN1cmU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBsYXN0X21lYXN1cmUgPSB0aGlzLm1vZGVsLmdldCgnbWVhc3VyZXMnKS5sYXN0KCk7XG4gICAgICAgIHZhciBuZXdfbWVhc3VyZSA9IGxhc3RfbWVhc3VyZS5jb3B5KHtcbiAgICAgICAgICAgIHByZXZfbWVhc3VyZTogbGFzdF9tZWFzdXJlLFxuICAgICAgICAgICAgbnVtYmVyOiBsYXN0X21lYXN1cmUuZ2V0KCdudW1iZXInKSArIDFcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGFzdF9tZWFzdXJlLnNldCgnbmV4dF9tZWFzdXJlJywgbmV3X21lYXN1cmUpO1xuICAgICAgICB0aGlzLm1vZGVsLmdldCgnbWVhc3VyZXMnKS5hZGQobmV3X21lYXN1cmUpO1xuXG4gICAgICAgIHZhciBtZWFzdXJlVmlldyA9IG5ldyBNZWFzdXJlVmlldyh7XG4gICAgICAgICAgICBtb2RlbDogbmV3X21lYXN1cmVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIG1lYXN1cmVWaWV3RWwgPSBtZWFzdXJlVmlldy5yZW5kZXIoKS4kZWw7XG5cbiAgICAgICAgaWYgKHRoaXMuJGVsLmZpbmQoJy5tZWFzdXJlLWFkZCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgbWVhc3VyZVZpZXdFbC5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLm1lYXN1cmUtYWRkJylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5hcHBlbmQobWVhc3VyZVZpZXdFbCk7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdfbWVhc3VyZS5zYXZlUmVjdXJzaXZlKCk7XG5cbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgbWVhc3VyZVZpZXdzID0gW107XG4gICAgICAgIHZhciBtZWFzdXJlVmlldztcblxuICAgICAgICB0aGlzLm1vZGVsLmdldCgnbWVhc3VyZXMnKS5lYWNoKGZ1bmN0aW9uKG1lYXN1cmUpIHtcblxuICAgICAgICAgICAgbWVhc3VyZVZpZXcgPSBuZXcgTWVhc3VyZVZpZXcoe1xuICAgICAgICAgICAgICAgIG1vZGVsOiBtZWFzdXJlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWVhc3VyZVZpZXdzLnB1c2gobWVhc3VyZVZpZXcucmVuZGVyKCkuZWwpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsLmFwcGVuZChtZWFzdXJlVmlld3MpO1xuXG4gICAgICAgIHZhciBtZWFzdXJlVm9pZCA9IDggLSB0aGlzLm1vZGVsLmdldCgnbWVhc3VyZXMnKS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKG1lYXN1cmVWb2lkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZE1lYXN1cmVBZGRXaWRnZXQobWVhc3VyZVZvaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgICB0YWdOYW1lOiAnZGl2JyxcbiAgICBjbGFzc05hbWU6ICdsaW5lLWVkaXQnLFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaW5pdExpc3RlbmVycygpO1xuICAgIH0sXG5cbiAgICBpbml0TGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nKCk7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZScsIHRoaXMucmVuZGVyKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayAubGV0dGVycyBsaSc6ICdjaG9vc2VMZXR0ZXInLFxuICAgICAgICAnY2hhbmdlIGlucHV0W25hbWU9bWVyZ2UtdXBdJzogJ21lcmdlVXAnLFxuICAgICAgICAnY2hhbmdlIGlucHV0W25hbWU9bWVyZ2UtZG93bl0nOiAnbWVyZ2VEb3duJyxcbiAgICAgICAgJ2NsaWNrIC5kaXNhYmxlLXNpZGViYXInOiAnZGlzYWJsZVNpZGViYXInLFxuICAgICAgICAnY2xpY2sgLmhlYWRlciAuY2xvc2UnOiAnaGlkZSdcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBPbmx5IHNob3cgdGhlIGVkaXQgd2lkZ2V0IHdoZW4gJ3Zpc2libGUnIGlzIHRydWUsXG4gICAgICAgIC8vIG90aGVyd2lzZSwgaGlkZSB0aGUgZWRpdCB3aWRnZXQuXG5cbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCd2aXNpYmxlJykpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH0sXG5cbiAgICBzaG93OiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5vZmZzZXQoKTtcblxuICAgICAgICB0aGlzLiRlbC5jc3Moe1xuICAgICAgICAgICAgdG9wOiBvZmZzZXQudG9wLFxuICAgICAgICAgICAgbGVmdDogb2Zmc2V0LmxlZnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wYXJzZUxldHRlcnMoKTtcbiAgICAgICAgdGhpcy5wYXJzZU1lcmdlT3B0aW9uKCk7XG5cbiAgICAgICAgdGhpcy4kZWwuc2hvdygpO1xuXG4gICAgfSxcblxuICAgIHBhcnNlTGV0dGVyczogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmxldHRlcnMgbGknKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblxuICAgICAgICB0aGlzLiRlbC5maW5kKFxuICAgICAgICAgICAgJy5sZXR0ZXJzIGxpWycgK1xuICAgICAgICAgICAgICAgICdkYXRhLWxldHRlcj0nICtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgnbGluZScpLmdldCgnbGV0dGVyJykgK1xuICAgICAgICAgICAgJ10nXG4gICAgICAgICkuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cbiAgICB9LFxuXG4gICAgcGFyc2VNZXJnZU9wdGlvbjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRoaXNfbGluZSA9IHRoaXMubW9kZWwuZ2V0KCdsaW5lJyk7XG4gICAgICAgIHZhciBwcmV2X2xpbmUgPSB0aGlzLm1vZGVsLmdldCgnbGluZScpLnByZXZpb3VzKCk7XG4gICAgICAgIHZhciBuZXh0X2xpbmUgPSB0aGlzLm1vZGVsLmdldCgnbGluZScpLm5leHQoKTtcblxuICAgICAgICB2YXIgbWVyZ2VfdXBfZWwgPSB0aGlzLiRlbC5maW5kKCcubWVyZ2UtdXAnKTtcbiAgICAgICAgdmFyIG1lcmdlX2Rvd25fZWwgPSB0aGlzLiRlbC5maW5kKCcubWVyZ2UtZG93bicpO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHByZXZfbGluZSAmJlxuICAgICAgICAgICAgcHJldl9saW5lLmdldCgnbGV0dGVyJykgPT0gdGhpc19saW5lLmdldCgnbGV0dGVyJylcbiAgICAgICAgKSB7XG5cbiAgICAgICAgICAgIGlmIChwcmV2X2xpbmUuZ2V0KCdtZXJnZV93aXRoX25leHRfbGluZScpKSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VfdXBfZWwuZmluZCgnaW5wdXQnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lcmdlX3VwX2VsLmZpbmQoJ2lucHV0JykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWVyZ2VfdXBfZWwuc2hvdygpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZXJnZV91cF9lbC5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBuZXh0X2xpbmUgJiZcbiAgICAgICAgICAgIG5leHRfbGluZS5nZXQoJ2xldHRlcicpID09IHRoaXNfbGluZS5nZXQoJ2xldHRlcicpXG4gICAgICAgICkge1xuXG4gICAgICAgICAgICBpZiAodGhpc19saW5lLmdldCgnbWVyZ2Vfd2l0aF9uZXh0X2xpbmUnKSkge1xuICAgICAgICAgICAgICAgIG1lcmdlX2Rvd25fZWwuZmluZCgnaW5wdXQnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lcmdlX2Rvd25fZWwuZmluZCgnaW5wdXQnKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtZXJnZV9kb3duX2VsLnNob3coKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVyZ2VfZG93bl9lbC5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBvZmZzZXQgb2YgdGhlIHdpZGdldC5cbiAgICAgKi9cbiAgICBvZmZzZXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBvZmZzZXQgPSB7XG4gICAgICAgICAgICB0b3A6IHRoaXMubW9kZWwuZ2V0KCdvZmZzZXQnKS50b3AsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLm1vZGVsLmdldCgnb2Zmc2V0JykubGVmdFxuICAgICAgICB9O1xuXG4gICAgICAgIG9mZnNldC50b3AgKz0gR0xPQkFMUy5zZXR0aW5ncy5ib3hfaGVpZ2h0IC8gMiArIDMwO1xuICAgICAgICBvZmZzZXQubGVmdCArPSBHTE9CQUxTLnNldHRpbmdzLnNlY3Rpb25fc2lkZWJhcl93aWR0aCAvIDIgLSAzMDtcblxuICAgICAgICByZXR1cm4gb2Zmc2V0O1xuXG4gICAgfSxcblxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBvbkNsb3NlID0gdGhpcy5tb2RlbC5nZXQoJ29uQ2xvc2UnKTtcblxuICAgICAgICBpZiAob25DbG9zZSkge1xuICAgICAgICAgICAgLy8gQ2FsbCBgb25DbG9zZSgpYCBjYWxsYmFjayBmdW5jdGlvbiBpZiBpdCBpc1xuICAgICAgICAgICAgLy8gZGVmaW5lZC5cbiAgICAgICAgICAgIG9uQ2xvc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGVsLmhpZGUoKTtcblxuICAgIH0sXG5cbiAgICBjaG9vc2VMZXR0ZXI6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIGxldHRlciA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGV0dGVyJyk7XG4gICAgICAgIHZhciBsaW5lID0gdGhpcy5tb2RlbC5nZXQoJ2xpbmUnKTtcblxuICAgICAgICBsaW5lLnNldCgnbGV0dGVyJywgbGV0dGVyKTtcbiAgICAgICAgbGluZS5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ3NlY3Rpb25fc2lkZWJhcicpLnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgfSxcblxuICAgIG1lcmdlVXA6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIHByZXZfbGluZSA9IHRoaXMubW9kZWwuZ2V0KCdsaW5lJykucHJldmlvdXMoKTtcblxuICAgICAgICBwcmV2X2xpbmUuc2V0KFxuICAgICAgICAgICAgJ21lcmdlX3dpdGhfbmV4dF9saW5lJyxcbiAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5pcygnOmNoZWNrZWQnKVxuICAgICAgICApO1xuXG4gICAgICAgIHByZXZfbGluZS5zYXZlKCk7XG5cbiAgICB9LFxuXG4gICAgbWVyZ2VEb3duOiBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgIHZhciBsaW5lID0gdGhpcy5tb2RlbC5nZXQoJ2xpbmUnKTtcblxuICAgICAgICBsaW5lLnNldChcbiAgICAgICAgICAgICdtZXJnZV93aXRoX25leHRfbGluZScsXG4gICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkuaXMoJzpjaGVja2VkJylcbiAgICAgICAgKTtcblxuICAgICAgICBsaW5lLnNhdmUoKTtcblxuICAgIH0sXG5cbiAgICBkaXNhYmxlU2lkZWJhcjogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHNlY3Rpb24gPSB0aGlzLm1vZGVsLmdldCgnc2VjdGlvbicpO1xuICAgICAgICBzZWN0aW9uLnNldCgnc2hvd19zaWRlYmFyJywgZmFsc2UpO1xuICAgICAgICBzZWN0aW9uLnNhdmUoKTtcblxuICAgICAgICB0aGlzLmhpZGUoKTtcblxuICAgIH1cblxufSk7XG4iLCJ2YXIgTWVhc3VyZSA9IHJlcXVpcmUoJy4uL21vZGVscy9tZWFzdXJlLmpzJyk7XG52YXIgbWVhc3VyZUVkaXQgPSByZXF1aXJlKCcuLi9pbml0L21lYXN1cmVfZWRpdC5qcycpO1xudmFyIE1lYXN1cmVXaWRnZXQgPSByZXF1aXJlKCcuLi93aWRnZXRzL21lYXN1cmUuanMnKTtcbnZhciBDaG9yZFZpZXcgPSByZXF1aXJlKCcuL2Nob3JkLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgICB0YWdOYW1lOiAndGQnLFxuICAgIGNsYXNzTmFtZTogJ21lYXN1cmUnLFxuICAgIG1vZGVsOiBNZWFzdXJlLFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLiRlbC5maW5kKCcuY2hvcmRzJykubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5odG1sKCc8ZGl2IGNsYXNzPVwiY2hvcmRzXCI+PC9kaXY+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNob3JkcyA9IHRoaXMuJGVsLmZpbmQoJy5jaG9yZHMnKTtcblxuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlcik7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2Rlc3Ryb3knLCB0aGlzLnJlbW92ZSk7XG5cbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayc6ICdvcGVuTWVhc3VyZUVkaXQnXG4gICAgfSxcblxuICAgIG9wZW5NZWFzdXJlRWRpdDogZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICBpZiAoIUdMT0JBTFMuZWRpdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcuY2hvcmQtbmFtZScpLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGNsaWNrIHdhcyBvbiBhIGNob3JkIG5hbWUsIHRoZSBjaG9yZCBlZGl0IHdpZGdldFxuICAgICAgICAgICAgLy8gc2hvdWxkIG9wZW4gYW5kIG5vdCB0aGUgbWVhc3VyZSBlZGl0IHdpZGdldC5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSBtZWFzdXJlIGVkaXQgd2lkZ2V0IGlzIGFscmVhZHkgb3BlbiBmb3IgdGhpcyBtZWFzdXJlXG4gICAgICAgIC8vIHRoZW4gY2xvc2UgaXQsIG90aGVyd2lzZSBvcGVuIGl0LlxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBtZWFzdXJlRWRpdC5nZXQoJ3Zpc2libGUnKSAmJlxuICAgICAgICAgICAgbWVhc3VyZUVkaXQuZ2V0KCdtZWFzdXJlJykgPT0gdGhpcy5tb2RlbFxuICAgICAgICApIHtcbiAgICAgICAgICAgIG1lYXN1cmVFZGl0LnNldCgndmlzaWJsZScsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gRG9uJ3QgYWxsb3cgdG8gcmVtb3ZlIHRoZSBtZWFzdXJlIGlmIGl0J3MgdGhlXG4gICAgICAgICAgICAvLyBsYXN0IG1lYXN1cmUgaW4gdGhlIGxhc3QgbGluZS5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgnbGluZScpLmdldCgnbWVhc3VyZXMnKS5sZW5ndGggPT0gMSAmJlxuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdsaW5lJykuZ2V0KCdzZWN0aW9uJykuZ2V0KCdsaW5lcycpLmxlbmd0aCA9PSAxXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZW1vdmVfcG9zc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlX3Bvc3NpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWVhc3VyZUVkaXQuc2V0KHtcbiAgICAgICAgICAgICAgICAndmlzaWJsZSc6IHRydWUsXG4gICAgICAgICAgICAgICAgJ21lYXN1cmUnOiB0aGlzLm1vZGVsLFxuICAgICAgICAgICAgICAgICdtZWFzdXJlX2VsJzogdGhpcy4kZWwsXG4gICAgICAgICAgICAgICAgJ2JlYXRfc2NoZW1hJzogdGhpcy5tb2RlbC5nZXQoJ2JlYXRfc2NoZW1hJyksXG4gICAgICAgICAgICAgICAgJ3JlbW92ZV9wb3NzaWJsZSc6IHJlbW92ZV9wb3NzaWJsZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY2hvcmRzLmh0bWwoJycpO1xuICAgICAgICB0aGlzLmRyYXdDaG9yZHMoKTtcbiAgICAgICAgdGhpcy5kcmF3U2VwZXJhdGlvbkxpbmVzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBkcmF3Q2hvcmRzOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnbWVhc3VyZS1iZWF0c2NoZW1hLScgK1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5wcmV2aW91c0F0dHJpYnV0ZXMoKS5iZWF0X3NjaGVtYVxuICAgICAgICApO1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnbWVhc3VyZS1iZWF0c2NoZW1hLScgKyBcbiAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdiZWF0X3NjaGVtYScpXG4gICAgICAgICk7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgYmVhdHMgPSB0aGlzLm1vZGVsLmdldCgnYmVhdF9zY2hlbWEnKS5zcGxpdCgnLScpO1xuXG4gICAgICAgIF8uZWFjaChiZWF0cywgZnVuY3Rpb24oY2hvcmQsIGkpIHtcblxuICAgICAgICAgICAgdGhhdC5jaG9yZHMuYXBwZW5kKFxuICAgICAgICAgICAgICAgIG5ldyBDaG9yZFZpZXcoe1xuICAgICAgICAgICAgICAgICAgICBtb2RlbDogdGhhdC5tb2RlbC5nZXQoJ2Nob3JkcycpLmF0KGkpXG4gICAgICAgICAgICAgICAgfSkucmVuZGVyKCkuZWxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9LFxuXG4gICAgZHJhd1NlcGVyYXRpb25MaW5lczogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIERyYXdzIHRoZSBsaW5lcyB0aGF0IHNlcGVyYXRlIHRoZSBkaWZmZXJlbnQgbWVhc3VyZSBwYXJ0c1xuICAgICAgICAvLyBpbnNpZGUgdGhlIG1lYXN1cmVcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCdjYW52YXMnKS5yZW1vdmUoKTtcblxuICAgICAgICBuZXcgTWVhc3VyZVdpZGdldChcbiAgICAgICAgICAgIHRoaXMuJGVsLFxuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ2JlYXRfc2NoZW1hJyksXG4gICAgICAgICAgICBHTE9CQUxTLnNldHRpbmdzLmJveF93aWR0aCxcbiAgICAgICAgICAgIEdMT0JBTFMuc2V0dGluZ3MuYm94X2hlaWdodCxcbiAgICAgICAgICAgIEdMT0JBTFMuc2V0dGluZ3MuYm9yZGVyX3dpZHRoXG4gICAgICAgICkubWVhc3VyZV9kcmF3X3NlcGFyYXRpb25fbGluZXMoKTtcblxuICAgIH1cblxufSk7XG4iLCJ2YXIgTWVhc3VyZUVkaXRNZWFzdXJlcyA9IHJlcXVpcmUoJy4uL2NvbGxlY3Rpb25zL21lYXN1cmVfZWRpdF9tZWFzdXJlcy5qcycpO1xudmFyIE1lYXN1cmVFZGl0ID0gcmVxdWlyZSgnLi4vbW9kZWxzL21lYXN1cmVfZWRpdC5qcycpO1xudmFyIE1lYXN1cmVFZGl0TWVhc3VyZSA9IHJlcXVpcmUoJy4uL21vZGVscy9tZWFzdXJlX2VkaXRfbWVhc3VyZS5qcycpO1xudmFyIE1lYXN1cmVFZGl0TWVhc3VyZVZpZXcgPSByZXF1aXJlKCcuL21lYXN1cmVfZWRpdF9tZWFzdXJlLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgICBtb2RlbDogTWVhc3VyZUVkaXQsXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pbml0TWVhc3VyZXMoKTtcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCAnY2hhbmdlJywgdGhpcy5jaGFuZ2UpO1xuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIC5jbG9zZSc6ICdjbG9zZScsXG4gICAgICAgICdjbGljayAucmVtb3ZlJzogJ3JlbW92ZU1lYXN1cmUnXG4gICAgfSxcblxuICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3Zpc2libGUnLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIHJlbW92ZU1lYXN1cmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm1vZGVsLmdldCgnbWVhc3VyZScpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSxcblxuICAgIGNoYW5nZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCd2aXNpYmxlJykpIHtcblxuICAgICAgICAgICAgLy8gT25seSBzZXQgdGhlIGJlYXRfc2NoZW1hIG9uIHRoZSBtZWFzdXJlIGlmIHRoZSBlZGl0XG4gICAgICAgICAgICAvLyB3aWRnZXQgaXMgdmlzaWJsZS5cbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGVsLnByZXZpb3VzQXR0cmlidXRlcygpLnZpc2libGUpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdtZWFzdXJlJykuc2V0KFxuICAgICAgICAgICAgICAgICAgICAnYmVhdF9zY2hlbWEnLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgnYmVhdF9zY2hlbWEnKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmdldCgnbWVhc3VyZScpLnNhdmVSZWN1cnNpdmUoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNob3coKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZWwuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgaW5pdE1lYXN1cmVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gQ3JlYXRlcyB0aGUgbWVhc3VyZXMgdGhhdCB3aWxsIGJlIHRoZSBjaG9pY2VzIGluIHRoZSBlZGl0XG4gICAgICAgIC8vIHdpZGdldCB0byBjaGFuZ2UgdGhlIG1lYXN1cmUuXG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgYmVhdF9zY2hlbWFzID0gWyc0JywgJzItMicsICcyLTEtMScsICcxLTEtMicsICcxLTEtMS0xJ107XG4gICAgICAgIHZhciBtZWFzdXJlcyA9IFtdO1xuICAgICAgICB2YXIgbWVhc3VyZVZpZXdzID0gW107XG4gICAgICAgIHZhciBtZWFzdXJlO1xuXG4gICAgICAgIF8uZWFjaChiZWF0X3NjaGVtYXMsIGZ1bmN0aW9uKGJlYXRfc2NoZW1hKSB7XG5cbiAgICAgICAgICAgIG1lYXN1cmUgPSBuZXcgTWVhc3VyZUVkaXRNZWFzdXJlKHtcbiAgICAgICAgICAgICAgICBiZWF0X3NjaGVtYTogYmVhdF9zY2hlbWEsXG4gICAgICAgICAgICAgICAgbWVhc3VyZUVkaXQ6IHRoYXQubW9kZWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWVhc3VyZXMucHVzaChtZWFzdXJlKTtcblxuICAgICAgICAgICAgbWVhc3VyZVZpZXdzLnB1c2gobmV3IE1lYXN1cmVFZGl0TWVhc3VyZVZpZXcoe1xuICAgICAgICAgICAgICAgIG1vZGVsOiBtZWFzdXJlXG4gICAgICAgICAgICB9KS5yZW5kZXIoKS5lbCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ21lYXN1cmVzJywgbmV3IE1lYXN1cmVFZGl0TWVhc3VyZXMobWVhc3VyZXMpKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLm1lYXN1cmVzJykuYXBwZW5kKG1lYXN1cmVWaWV3cyk7XG5cbiAgICB9LFxuXG4gICAgc2hvdzogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIG1lYXN1cmUgPSB0aGlzLm1vZGVsLmdldCgnbWVhc3VyZV9lbCcpO1xuXG4gICAgICAgIHRoaXMuJGVsLmNzcyh7XG4gICAgICAgICAgICAndG9wJzogbWVhc3VyZS5vZmZzZXQoKS50b3AgKyBtZWFzdXJlLmhlaWdodCgpICsgMTAsXG4gICAgICAgICAgICAnbGVmdCc6IG1lYXN1cmUub2Zmc2V0KCkubGVmdCAtIDEwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjdXJyZW50X3NlbGVjdGVkID0gdGhpcy5tb2RlbC5nZXQoJ21lYXN1cmVzJykuZmluZFdoZXJlKHtcbiAgICAgICAgICAgICdzZWxlY3RlZCc6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRfc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGN1cnJlbnRfc2VsZWN0ZWQuc2V0KCdzZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW9kZWwuZ2V0KCdtZWFzdXJlcycpLmZpbmRXaGVyZSh7XG4gICAgICAgICAgICAnYmVhdF9zY2hlbWEnOiB0aGlzLm1vZGVsLmdldCgnYmVhdF9zY2hlbWEnKVxuICAgICAgICB9KS5zZXQoJ3NlbGVjdGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdyZW1vdmVfcG9zc2libGUnKSkge1xuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLnJlbW92ZScpLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5yZW1vdmUnKS5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRlbC5zaG93KCk7XG5cbiAgICB9XG5cbn0pO1xuIiwidmFyIE1lYXN1cmVFZGl0TWVhc3VyZSA9IHJlcXVpcmUoJy4uL21vZGVscy9tZWFzdXJlX2VkaXRfbWVhc3VyZS5qcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gICAgbW9kZWw6IE1lYXN1cmVFZGl0TWVhc3VyZSxcbiAgICB0YWdOYW1lOiAnbGknLFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZScsIHRoaXMucmVuZGVyKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayc6ICdjaG9vc2VCZWF0U2NoZW1hJ1xuICAgIH0sXG5cbiAgICBjaG9vc2VCZWF0U2NoZW1hOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB0aGlzLm1vZGVsLmdldCgnbWVhc3VyZUVkaXQnKS5zZXQoXG4gICAgICAgICAgICAnYmVhdF9zY2hlbWEnLFxuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ2JlYXRfc2NoZW1hJylcbiAgICAgICAgKTtcblxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICghdGhpcy5tZWFzdXJlc19kcmF3bikge1xuICAgICAgICAgICAgdGhpcy5kcmF3TWVhc3VyZXMoKTtcbiAgICAgICAgICAgIHRoaXMubWVhc3VyZXNfZHJhd24gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdzZWxlY3RlZCcpKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcubWVhc3VyZScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLm1lYXN1cmUnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfSxcblxuICAgIGRyYXdNZWFzdXJlczogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRlbXBsYXRlID0gXy50ZW1wbGF0ZShcbiAgICAgICAgICAgICQoJyN0ZW1wbGF0ZS1tZWFzdXJlLWVkaXQtbWVhc3VyZScpLmh0bWwoKVxuICAgICAgICApO1xuXG4gICAgICAgIHZhciBudW1fY2hvcmRzO1xuXG4gICAgICAgIHN3aXRjaCh0aGlzLm1vZGVsLmdldCgnYmVhdF9zY2hlbWEnKSkge1xuXG4gICAgICAgICAgICBjYXNlICc0JzpcbiAgICAgICAgICAgICAgICBudW1fY2hvcmRzID0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnMi0yJzpcbiAgICAgICAgICAgICAgICBudW1fY2hvcmRzID0gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnMi0xLTEnOlxuICAgICAgICAgICAgY2FzZSAnMS0xLTInOlxuICAgICAgICAgICAgICAgIG51bV9jaG9yZHMgPSAzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICcxLTEtMS0xJzpcbiAgICAgICAgICAgICAgICBudW1fY2hvcmRzID0gNDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kZWwuaHRtbChcbiAgICAgICAgICAgIHRlbXBsYXRlKHtcbiAgICAgICAgICAgICAgICBiZWF0X3NjaGVtYTogdGhpcy5tb2RlbC5nZXQoJ2JlYXRfc2NoZW1hJyksXG4gICAgICAgICAgICAgICAgbnVtX2Nob3JkczogbnVtX2Nob3Jkc1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmRyYXdTZXBlcmF0aW9uTGluZXMoKTtcblxuICAgIH0sXG5cbiAgICBkcmF3U2VwZXJhdGlvbkxpbmVzOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuJGVsLmZpbmQoJy5tZWFzdXJlJyk7XG4gICAgICAgIHZhciBjYW52YXM7XG4gICAgICAgIHZhciBjb250ZXh0O1xuXG4gICAgICAgIHN3aXRjaCh0aGlzLm1vZGVsLmdldCgnYmVhdF9zY2hlbWEnKSkge1xuXG4gICAgICAgICAgICBjYXNlICcyLTInOlxuXG4gICAgICAgICAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSA1MDtcbiAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gNTA7XG5cbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG5cbiAgICAgICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKDUwLCAwKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbygwLCA1MCk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnQucHJlcGVuZChjYW52YXMpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJzItMS0xJzpcblxuICAgICAgICAgICAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgY2FudmFzLndpZHRoID0gNTA7XG4gICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IDUwO1xuXG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuXG4gICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyg1MCwgMCk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oMCwgNTApO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKDI1LCAyNSk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oNTAsIDUwKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudC5wcmVwZW5kKGNhbnZhcyk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnMS0xLTInOlxuXG4gICAgICAgICAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSA1MDtcbiAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gNTA7XG5cbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG5cbiAgICAgICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKDUwLCAwKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbygwLCA1MCk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oMCwgMCk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oMjUsIDI1KTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudC5wcmVwZW5kKGNhbnZhcyk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnMS0xLTEtMSc6XG5cbiAgICAgICAgICAgICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICAgICAgICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IDUwO1xuICAgICAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSA1MDtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gMTtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oNTAsIDApO1xuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKDAsIDUwKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbygwLCAwKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyg1MCwgNTApO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50LnByZXBlbmQoY2FudmFzKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxufSk7XG4iLCJ2YXIgTGluZSA9IHJlcXVpcmUoJy4uL21vZGVscy9saW5lLmpzJyk7XG52YXIgU2VjdGlvblNpZGViYXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvc2VjdGlvbl9zaWRlYmFyLmpzJyk7XG52YXIgc2VjdGlvbkVkaXQgPSByZXF1aXJlKCcuLi9pbml0L3NlY3Rpb25fZWRpdC5qcycpO1xudmFyIFNlY3Rpb25TaWRlYmFyVmlldyA9IHJlcXVpcmUoJy4vc2VjdGlvbl9zaWRlYmFyLmpzJyk7XG52YXIgTGluZVZpZXcgPSByZXF1aXJlKCcuL2xpbmUuanMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICAgIHRhZ05hbWU6ICdzZWN0aW9uJyxcbiAgICBjbGFzc05hbWU6ICdzZWN0aW9uJyxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmluaXRMaXN0ZW5lcnMoKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayAuc2VjdGlvbi1oZWFkZXIgLm5hbWUnOiAndG9nZ2xlU2VjdGlvbkVkaXQnLFxuICAgICAgICAnY2xpY2sgLnNlY3Rpb24taGVhZGVyIC5zZWN0aW9uLWVkaXQtYnV0dG9ucyAubW92ZS11cCc6ICdtb3ZlVXAnLFxuICAgICAgICAnY2xpY2sgLnNlY3Rpb24taGVhZGVyIC5zZWN0aW9uLWVkaXQtYnV0dG9ucyAubW92ZS1kb3duJzogJ21vdmVEb3duJyxcbiAgICAgICAgJ2NsaWNrIC5zZWN0aW9uLWhlYWRlciAuc2VjdGlvbi1lZGl0LWJ1dHRvbnMgLnJlbW92ZSc6ICdyZW1vdmVTZWN0aW9uJyxcbiAgICAgICAgJ2NsaWNrIC5saW5lLWFkZCAucGx1cyc6ICdhZGRMaW5lJyxcbiAgICB9LFxuXG4gICAgaW5pdExpc3RlbmVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3RvcExpc3RlbmluZygpO1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlcik7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbC5nZXQoJ2xpbmVzJyksICdyZW1vdmUnLCB0aGlzLnJlbmRlclNpZGViYXIpO1xuICAgIH0sXG5cbiAgICB0b2dnbGVTZWN0aW9uRWRpdDogZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICBpZiAoIUdMT0JBTFMuZWRpdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlY3Rpb25FZGl0LmdldCgndmlzaWJsZScpKSB7XG4gICAgICAgICAgICBzZWN0aW9uRWRpdC5zZXQoJ3Zpc2libGUnLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWN0aW9uRWRpdC5zZXQoe1xuICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgc2VjdGlvbjogdGhpcy5tb2RlbCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6ICQoZXZlbnQudGFyZ2V0KS5vZmZzZXQoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IF8udGVtcGxhdGUoXG4gICAgICAgICAgICAkKCcjdGVtcGxhdGUtc2VjdGlvbicpLmh0bWwoKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuJGVsLmh0bWwodGVtcGxhdGUoKSk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJIZWFkZXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJTaWRlYmFyKCk7XG4gICAgICAgIHRoaXMucmVuZGVyTGluZXMoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH0sXG5cbiAgICByZW5kZXJIZWFkZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI3RlbXBsYXRlLXNlY3Rpb24taGVhZGVyJykuaHRtbCgpKTtcbiAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5tb2RlbC5nZXQoJ3RpdGxlJykgfHwgJ1VudGl0bGVkIHNlY3Rpb24nO1xuICAgICAgICB2YXIgc2VjdGlvbl9oZWFkZXIgPSB0ZW1wbGF0ZSh7IHNlY3Rpb25fdGl0bGU6IHRpdGxlIH0pO1xuICAgICAgICB2YXIgc2VjdGlvbl9oZWFkZXJfZWwgPSB0aGlzLiRlbC5maW5kKCcuc2VjdGlvbi1oZWFkZXInKTtcblxuICAgICAgICBzZWN0aW9uX2hlYWRlcl9lbC5odG1sKHNlY3Rpb25faGVhZGVyKTtcblxuICAgICAgICB2YXIgZWRpdF9idXR0b25zX2VsID0gdGhpcy4kZWwuZmluZChcbiAgICAgICAgICAgICcuc2VjdGlvbi1oZWFkZXIgLnNlY3Rpb24tZWRpdC1idXR0b25zJ1xuICAgICAgICApO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi5zaXplKCkgPT0gMSB8fFxuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ251bWJlcicpID09IDFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBlZGl0X2J1dHRvbnNfZWwuZmluZCgnLm1vdmUtdXAnKS5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24uc2l6ZSgpID09IDEgfHxcbiAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdudW1iZXInKSA9PSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgICAgZWRpdF9idXR0b25zX2VsLmZpbmQoJy5tb3ZlLWRvd24nKS5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tb2RlbC5jb2xsZWN0aW9uLnNpemUoKSA9PSAxKSB7XG4gICAgICAgICAgICBlZGl0X2J1dHRvbnNfZWwuZmluZCgnLnJlbW92ZScpLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHJlbmRlclNpZGViYXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBzZWN0aW9uU2lkZWJhciA9IG5ldyBTZWN0aW9uU2lkZWJhcih7XG4gICAgICAgICAgICBzZWN0aW9uOiB0aGlzLm1vZGVsLFxuICAgICAgICAgICAgZWRpdDogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHNlY3Rpb25TaWRlYmFyVmlldyA9IG5ldyBTZWN0aW9uU2lkZWJhclZpZXcoe1xuICAgICAgICAgICAgbW9kZWw6IHNlY3Rpb25TaWRlYmFyXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWN0aW9uLXNpZGViYXInKS5yZXBsYWNlV2l0aChcbiAgICAgICAgICAgIHNlY3Rpb25TaWRlYmFyVmlldy5yZW5kZXIoKS5lbFxuICAgICAgICApO1xuXG4gICAgfSxcblxuICAgIHJlbmRlckxpbmVzOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgbGluZVZpZXdzID0gW107XG4gICAgICAgIHZhciBsaW5lVmlldztcblxuICAgICAgICB0aGlzLm1vZGVsLmdldCgnbGluZXMnKS5lYWNoKGZ1bmN0aW9uKGxpbmUpIHtcblxuICAgICAgICAgICAgbGluZVZpZXcgPSBuZXcgTGluZVZpZXcoe1xuICAgICAgICAgICAgICAgIG1vZGVsOiBsaW5lXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGluZVZpZXdzLnB1c2gobGluZVZpZXcucmVuZGVyKCkuZWwpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBsaW5lc19lbCA9IHRoaXMuJGVsLmZpbmQoJy5saW5lcycpO1xuXG4gICAgICAgIGxpbmVzX2VsLmh0bWwoJycpO1xuICAgICAgICBsaW5lc19lbC5hcHBlbmQobGluZVZpZXdzKTtcblxuICAgIH0sXG5cbiAgICBtb3ZlVXA6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHRoaXMuJGVsLmFmdGVyKHRoaXMuJGVsLnByZXYoKSk7XG5cbiAgICAgICAgdmFyIHRoaXNfc2VjdGlvbl9udW1iZXIgPSB0aGlzLm1vZGVsLmdldCgnbnVtYmVyJyk7XG5cbiAgICAgICAgdmFyIHByZXZfc2VjdGlvbiA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5maW5kKFxuICAgICAgICAgICAgZnVuY3Rpb24oc2VjdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWN0aW9uLmdldCgnbnVtYmVyJykgPT0gdGhpc19zZWN0aW9uX251bWJlciAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdmFyIHByZXZfc2VjdGlvbl9udW1iZXIgPSBwcmV2X3NlY3Rpb24uZ2V0KCdudW1iZXInKTtcbiAgICAgICAgcHJldl9zZWN0aW9uLnNldCgnbnVtYmVyJywgdGhpc19zZWN0aW9uX251bWJlcik7XG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdudW1iZXInLCBwcmV2X3NlY3Rpb25fbnVtYmVyKTtcbiAgICAgICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnNvcnQoKTtcblxuICAgICAgICB0aGlzLm1vZGVsLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICBwcmV2X3NlY3Rpb24udHJpZ2dlcignY2hhbmdlJyk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zYXZlKCk7XG4gICAgICAgIHByZXZfc2VjdGlvbi5zYXZlKCk7XG5cbiAgICB9LFxuXG4gICAgbW92ZURvd246IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHRoaXMuJGVsLmJlZm9yZSh0aGlzLiRlbC5uZXh0KCkpO1xuXG4gICAgICAgIHZhciB0aGlzX3NlY3Rpb25fbnVtYmVyID0gdGhpcy5tb2RlbC5nZXQoJ251bWJlcicpO1xuXG4gICAgICAgIHZhciBuZXh0X3NlY3Rpb24gPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24uZmluZChcbiAgICAgICAgICAgIGZ1bmN0aW9uKHNlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VjdGlvbi5nZXQoJ251bWJlcicpID09IHRoaXNfc2VjdGlvbl9udW1iZXIgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHZhciBuZXh0X3NlY3Rpb25fbnVtYmVyID0gbmV4dF9zZWN0aW9uLmdldCgnbnVtYmVyJyk7XG4gICAgICAgIG5leHRfc2VjdGlvbi5zZXQoJ251bWJlcicsIHRoaXNfc2VjdGlvbl9udW1iZXIpO1xuICAgICAgICB0aGlzLm1vZGVsLnNldCgnbnVtYmVyJywgbmV4dF9zZWN0aW9uX251bWJlcik7XG4gICAgICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi5zb3J0KCk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgbmV4dF9zZWN0aW9uLnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgICAgIHRoaXMubW9kZWwuc2F2ZSgpO1xuICAgICAgICBuZXh0X3NlY3Rpb24uc2F2ZSgpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBsaW5lIGluIHRoaXMgc2VjdGlvbi5cbiAgICAgKi9cbiAgICBhZGRMaW5lOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgbGFzdF9saW5lID0gdGhpcy5tb2RlbC5nZXQoJ2xpbmVzJykubGFzdCgpO1xuICAgICAgICB2YXIgbmV3X2xpbmUgPSBsYXN0X2xpbmUuY29weSh7XG4gICAgICAgICAgICBudW1iZXI6IGxhc3RfbGluZS5nZXQoJ251bWJlcicpICsgMVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgbmV3X21lYXN1cmUgPSBuZXdfbGluZS5nZXQoJ21lYXN1cmVzJykuZmlyc3QoKS5jb3B5KCk7XG5cbiAgICAgICAgbmV3X21lYXN1cmUudW5zZXQoJ25leHRfbWVhc3VyZScpO1xuICAgICAgICBuZXdfbGluZS5nZXQoJ21lYXN1cmVzJykucmVzZXQoW25ld19tZWFzdXJlXSk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ2xpbmVzJykuYWRkKG5ld19saW5lKTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgbmV3X2xpbmUuc2F2ZVJlY3Vyc2l2ZSgpO1xuXG4gICAgfSxcblxuICAgIHJlbW92ZVNlY3Rpb246IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbW92ZSB0aGlzIHNlY3Rpb24/XCIpKSB7XG5cbiAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uO1xuXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGNvbGxlY3Rpb24ucmVzZXROdW1iZXJzKCk7XG5cbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnNpemUoKSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgb25seSBvbmUgc2VjdGlvbiBsZWZ0LCB0aGUgbW92ZVxuICAgICAgICAgICAgICAgIC8vIGFuZCByZW1vdmUgYnV0dG9ucyBzaG91bGQgYmUgcmVtb3ZlZC4gU28gd2VcbiAgICAgICAgICAgICAgICAvLyB0cmlnZ2VyIGEgJ2NoYW5nZScgZXZlbnQgc28gdGhhdCBpdCB3aWxsXG4gICAgICAgICAgICAgICAgLy8gcmVyZW5kZXIgaXRzZWxmLlxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmlyc3QoKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG59KTtcbiIsInZhciBTZWN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL3NlY3Rpb24uanMnKTtcbnZhciBTZWN0aW9uS2V5ID0gcmVxdWlyZSgnLi4vbW9kZWxzL3NlY3Rpb25fa2V5LmpzJyk7XG52YXIgdHJhbnNwb3NlV2lkZ2V0ID0gcmVxdWlyZSgnLi4vaW5pdC90cmFuc3Bvc2Vfd2lkZ2V0LmpzJyk7XG52YXIgS2V5U2VsZWN0V2lkZ2V0ID0gcmVxdWlyZSgnLi4vd2lkZ2V0cy9rZXlfc2VsZWN0LmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgICBtb2RlbDogU2VjdGlvbixcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2hhbmdlIGlucHV0W3R5cGU9cmFkaW9dJzogJ2NoYW5nZVNlY3Rpb25UaXRsZScsXG4gICAgICAgICdjbGljayBpbnB1dFt0eXBlPXJhZGlvXSc6ICdjaGFuZ2VTZWN0aW9uVGl0bGUnLFxuICAgICAgICAna2V5dXAgLnRpdGxlLWlucHV0JzogJ3RpdGxlQ2hhbmdlZCcsXG4gICAgICAgICdjbGljayAuY2xvc2UnOiAnY2xvc2UnXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdmFyIGtleVNlbGVjdFdpZGdldERlbGVnYXRlID0gZnVuY3Rpb24oKSB7IH07XG5cbiAgICAgICAga2V5U2VsZWN0V2lkZ2V0RGVsZWdhdGUua2V5X2NoYW5nZWQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHRoYXQudXBkYXRlS2V5KGtleSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5rZXlTZWxlY3RXaWRnZXQgPSBuZXcgS2V5U2VsZWN0V2lkZ2V0KFxuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLmtleS1zZWxlY3Qtd2lkZ2V0JyksXG4gICAgICAgICAgICBrZXlTZWxlY3RXaWRnZXREZWxlZ2F0ZVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZScsIHRoaXMuY2hhbmdlKTtcblxuICAgIH0sXG5cbiAgICBjaGFuZ2U6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGVsLmdldCgndmlzaWJsZScpKSB7XG4gICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdzZWN0aW9uJykuc2F2ZSgpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm1vZGVsLnNldCgndmlzaWJsZScsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgc2hvdzogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdGhpcy4kZWwuY3NzKHtcbiAgICAgICAgICAgICd0b3AnOiB0aGlzLm1vZGVsLmdldCgnb2Zmc2V0JykudG9wICsgNDIsXG4gICAgICAgICAgICAnbGVmdCc6IHRoaXMubW9kZWwuZ2V0KCdvZmZzZXQnKS5sZWZ0IC0gMTVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnRpdGxlLWlucHV0JykudmFsKFxuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ3NlY3Rpb24nKS5nZXQoJ3RpdGxlJylcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5tb2RlbC5nZXQoJ3NlY3Rpb24nKS5nZXQoJ3RpdGxlJykpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy50aXRsZS1yYWRpbycpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5uby10aXRsZS1yYWRpbycpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMua2V5U2VsZWN0V2lkZ2V0LnVwZGF0ZUtleShcbiAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdzZWN0aW9uJykuZ2V0KCdrZXknKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuJGVsLnNob3coKTtcblxuICAgICAgICB2YXIgdGl0bGVfaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcudGl0bGUtaW5wdXQnKTtcblxuICAgICAgICAvLyBzZXQgZm9jdXMgb24gdGV4dCBmaWVsZFxuICAgICAgICB0aXRsZV9pbnB1dC5mb2N1cygpO1xuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgY3Vyc29yIGlzIGF0IHRoZSBlbmRcbiAgICAgICAgdmFyIG9yaWdfdmFsdWUgPSB0aXRsZV9pbnB1dC52YWwoKTtcbiAgICAgICAgdGl0bGVfaW5wdXQudmFsKCcnKTtcbiAgICAgICAgdGl0bGVfaW5wdXQudmFsKG9yaWdfdmFsdWUpO1xuXG4gICAgfSxcblxuICAgIGNoYW5nZVNlY3Rpb25UaXRsZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ3NlY3Rpb24nKS5zZXQoXG4gICAgICAgICAgICAndGl0bGUnLCBcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy50aXRsZS1pbnB1dCcpLnZhbCgpLnRyaW0oKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy50aXRsZS1pbnB1dCcpLmZvY3VzKCk7XG5cbiAgICB9LFxuXG4gICAgdGl0bGVDaGFuZ2VkOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB0aGlzLmNoYW5nZVNlY3Rpb25UaXRsZSgpO1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGVLZXk6IGZ1bmN0aW9uKG5ld19rZXkpIHtcblxuICAgICAgICB0aGlzLm1vZGVsLmdldCgnc2VjdGlvbicpLnNldCgna2V5JywgbmV3X2tleSk7XG4gICAgICAgIG5ldyBTZWN0aW9uS2V5KHsgc2VjdGlvbjogdGhpcy5tb2RlbC5nZXQoJ3NlY3Rpb24nKSB9KS5zYXZlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdzZWN0aW9uJykuZ2V0KCdudW1iZXInKSA9PSAxKSB7XG4gICAgICAgICAgICB0cmFuc3Bvc2VXaWRnZXQuc2V0KCdrZXknLCBuZXdfa2V5KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KTtcbiIsInZhciBsaW5lRWRpdCA9IHJlcXVpcmUoJy4uL2luaXQvbGluZV9lZGl0LmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgICB0YWdOYW1lOiAnZGl2JyxcbiAgICBjbGFzc05hbWU6ICdzZWN0aW9uLXNpZGViYXInLFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdGhpcy5zaWRlYmFyX3RlbXBsYXRlID0gXy50ZW1wbGF0ZShcbiAgICAgICAgICAgICQoJyN0ZW1wbGF0ZS1zZWN0aW9uLXNpZGViYXItcGFydCcpLmh0bWwoKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuaW5pdExpc3RlbmVycygpO1xuXG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnbW91c2VvdmVyJzogJ21vdXNlb3ZlcicsXG4gICAgICAgICdtb3VzZW91dCc6ICdtb3VzZW91dCcsXG4gICAgICAgICdjbGljayc6ICdjbGljaydcbiAgICB9LFxuXG4gICAgaW5pdExpc3RlbmVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3RvcExpc3RlbmluZygpO1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlcik7XG4gICAgfSxcblxuICAgIG1vdXNlb3ZlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChHTE9CQUxTLmVkaXQpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2V0KCdtb3VzZW92ZXInLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBtb3VzZW91dDogZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICAvLyBBIG1vdXNlb3V0IGV2ZW50IGlzIHRyaWdnZXJlZCB3aGVuIHdlIGFwcGVuZCBjaGlsZHNcbiAgICAgICAgLy8gdG8gdGhlIHNlY3Rpb24tc2lkZWJhciBkaXYuIFNvIHdlIGNoZWNrIGhlcmUgaWYgdGhlXG4gICAgICAgIC8vIGBldmVudC5yZWxhdGVkVGFyZ2V0YCAod2hpY2ggaXMgdGhlIGVsZW1lbnQgdGhlIG1vdXNlXG4gICAgICAgIC8vIGlzIG5vdyBvbikgaXMgYSBjaGlsZCBvZiB0aGUgc2lkZWJhci5cbiAgICAgICAgLy8gSWYgc28sIGRvbid0IHB1dCBgZWRpdGAgdG8gYGZhbHNlYC5cbiAgICAgICAgaWYgKCQoZXZlbnQucmVsYXRlZFRhcmdldCkuY2xvc2VzdCgnLnNlY3Rpb24tc2lkZWJhcicpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ21vdXNlb3ZlcicsIGZhbHNlKTtcblxuICAgIH0sXG5cbiAgICBjbGljazogZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICBpZiAoIUdMT0JBTFMuZWRpdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdzZWN0aW9uJykuZ2V0KCdzaG93X3NpZGViYXInKSkge1xuXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xuICAgICAgICAgICAgdmFyIGxpbmVfbnVtYmVyID0gdGFyZ2V0LmNsb3Nlc3QoJy5zZWN0aW9uLXNpZGViYXItcGFydCcpLmRhdGEoJ2xpbmUtbnVtYmVyJyk7XG4gICAgICAgICAgICB2YXIgbGluZSA9IHRoaXMubW9kZWwuZ2V0KCdzZWN0aW9uJykuZ2V0KCdsaW5lcycpLmZpbmRXaGVyZSh7XG4gICAgICAgICAgICAgICAgbnVtYmVyOiBsaW5lX251bWJlclxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBsaW5lRWRpdC5nZXQoJ3Zpc2libGUnKSAmJlxuICAgICAgICAgICAgICAgIGxpbmVFZGl0LmdldCgnbGluZScpID09IGxpbmVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGxpbmVFZGl0LnNldCgndmlzaWJsZScsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnNldCgnZm9yY2VNb2RlJywgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGxpbmVFZGl0LnNldCh7XG4gICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHNlY3Rpb25fc2lkZWJhcjogdGhpcy5tb2RlbCxcbiAgICAgICAgICAgICAgICAgICAgc2VjdGlvbjogdGhpcy5tb2RlbC5nZXQoJ3NlY3Rpb24nKSxcbiAgICAgICAgICAgICAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiB0YXJnZXQub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb2RlbC5zZXQoJ2ZvcmNlTW9kZScsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ2ZvcmNlTW9kZScsICdlZGl0JywgeyBzaWxlbnQ6IHRydWUgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ3NlY3Rpb24nKS5zZXQoJ3Nob3dfc2lkZWJhcicsIHRydWUpLnNhdmUoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHRoaXMuJGVsLmh0bWwoJycpO1xuICAgICAgICB0aGlzLiRlbC5jc3Moe1xuICAgICAgICAgICAgJ2hlaWdodCc6IHRoaXMubW9kZWwuZ2V0KCdzZWN0aW9uJykuaGVpZ2h0KCksXG4gICAgICAgICAgICAnd2lkdGgnOiBHTE9CQUxTLnNldHRpbmdzLnNlY3Rpb25fc2lkZWJhcl93aWR0aFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlbmRlckxldHRlcnMoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH0sXG5cbiAgICByZW5kZXJMZXR0ZXJzOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgbW9kZTtcbiAgICAgICAgdmFyIHNob3dfc2lkZWJhciA9IHRoaXMubW9kZWwuZ2V0KCdzZWN0aW9uJykuZ2V0KCdzaG93X3NpZGViYXInKTtcbiAgICAgICAgdmFyIG1vdXNlb3ZlciA9IHRoaXMubW9kZWwuZ2V0KCdtb3VzZW92ZXInKTtcblxuICAgICAgICBpZiAoc2hvd19zaWRlYmFyIHx8IG1vdXNlb3Zlcikge1xuXG4gICAgICAgICAgICBtb2RlID0gdGhpcy5tb2RlbC5nZXQoJ2ZvcmNlTW9kZScpO1xuXG4gICAgICAgICAgICBpZiAoIW1vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2hvd19zaWRlYmFyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb3VzZW92ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGUgPSAnZWRpdCc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlID0gJ2FjdGl2ZSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtb2RlID0gJ2luYWN0aXZlJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtb2RlID09ICdlZGl0Jykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyTGV0dGVyRWRpdChtb2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJMZXR0ZXJQYXJ0cyhtb2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgcmVuZGVyTGV0dGVyUGFydHM6IGZ1bmN0aW9uKG1vZGUpIHtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciBwYXJ0cyA9IHRoaXMuZ2V0TGV0dGVyUGFydHMoKTtcblxuICAgICAgICBfLmVhY2gocGFydHMsIGZ1bmN0aW9uKHBhcnQpIHtcblxuICAgICAgICAgICAgdmFyIGhlaWdodCA9IHBhcnQubGluZXNfbnVtYmVyICogR0xPQkFMUy5zZXR0aW5ncy5ib3hfaGVpZ2h0O1xuXG4gICAgICAgICAgICB2YXIgcGFydF9lbCA9ICQodGhhdC5zaWRlYmFyX3RlbXBsYXRlKHtcbiAgICAgICAgICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICAgICAgICAgIGxpbmVfbnVtYmVyOiBudWxsLFxuICAgICAgICAgICAgICAgIGxldHRlcjogcGFydC5sZXR0ZXIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IEdMT0JBTFMuc2V0dGluZ3Muc2VjdGlvbl9zaWRlYmFyX3dpZHRoXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHRoYXQuJGVsLmFwcGVuZChwYXJ0X2VsKTtcblxuICAgICAgICAgICAgaWYgKHBhcnQubGluZXNfbnVtYmVyID4gMSkge1xuICAgICAgICAgICAgICAgIHRoYXQuYWRkSW5kaWNhdG9yTGluZXMoXG4gICAgICAgICAgICAgICAgICAgIHBhcnRfZWwuZmluZCgnY2FudmFzJylbMF0sXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgbW9kZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBwYXJ0cyBmb3IgdGhlIGxldHRlcnMuXG4gICAgICpcbiAgICAgKiBBIHBhcnQgaXMgb25lIG9yIG1vcmUgbGluZXMgdGhhdCBmb3JtIG9uZSBzdWJzZWN0aW9uIG9mXG4gICAgICogdGhlIHNvbmcuIEl0IGhhcyB0d28gZmllbGRzOlxuICAgICAqIGxldHRlciAgICAgICAgLSBUaGUgbGV0dGVyIGZvciB0aGlzIHBhcnQuXG4gICAgICogbGluZXNfbnVtYmVyICAtIE51bWJlciBvZiBzdWJzZXF1ZW50IGxpbmVzIHRoYXQgc2hhcmVcbiAgICAgKiAgICAgICAgICAgICAgICAgdGhpcyBsZXR0ZXIuXG4gICAgICovXG4gICAgZ2V0TGV0dGVyUGFydHM6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBwYXJ0cyA9IFtdO1xuICAgICAgICB2YXIgcHJldl9saW5lID0gZmFsc2U7XG4gICAgICAgIHZhciBsaW5lc19udW1iZXIgPSAwO1xuXG4gICAgICAgIHRoaXMubW9kZWwuZ2V0KCdzZWN0aW9uJykuZ2V0KCdsaW5lcycpLmVhY2goZnVuY3Rpb24obGluZSkge1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgcHJldl9saW5lICYmXG4gICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICBwcmV2X2xpbmUuZ2V0KCdsZXR0ZXInKSAhPSBsaW5lLmdldCgnbGV0dGVyJykgfHxcbiAgICAgICAgICAgICAgICAgICAgIXByZXZfbGluZS5nZXQoJ21lcmdlX3dpdGhfbmV4dF9saW5lJylcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcblxuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBsZXR0ZXI6IHByZXZfbGluZS5nZXQoJ2xldHRlcicpLFxuICAgICAgICAgICAgICAgICAgICBsaW5lc19udW1iZXI6IGxpbmVzX251bWJlclxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbGluZXNfbnVtYmVyID0gMDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5lc19udW1iZXIrKztcbiAgICAgICAgICAgIHByZXZfbGluZSA9IGxpbmU7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGFydHMucHVzaCh7XG4gICAgICAgICAgICBsZXR0ZXI6IHByZXZfbGluZS5nZXQoJ2xldHRlcicpLFxuICAgICAgICAgICAgbGluZXNfbnVtYmVyOiBsaW5lc19udW1iZXJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnRzO1xuXG4gICAgfSxcblxuICAgIGFkZEluZGljYXRvckxpbmVzOiBmdW5jdGlvbihjYW52YXNfZWwsIGhlaWdodCwgbW9kZSkge1xuXG4gICAgICAgIHZhciB3aWR0aCA9IEdMT0JBTFMuc2V0dGluZ3Muc2VjdGlvbl9zaWRlYmFyX3dpZHRoO1xuICAgICAgICB2YXIgc2lkZWJhcl9oYWxmX3dpZHRoID0gTWF0aC5yb3VuZCh3aWR0aCAvIDIpO1xuICAgICAgICB2YXIgYm94X2hlaWdodCA9IEdMT0JBTFMuc2V0dGluZ3MuYm94X2hlaWdodDtcbiAgICAgICAgdmFyIGxpbmVfbWFyZ2luID0gTWF0aC5yb3VuZChib3hfaGVpZ2h0ICogMC4xNSk7XG4gICAgICAgIHZhciBzZWN0aW9uX2hhbGZfaGVpZ2h0ID0gTWF0aC5yb3VuZChoZWlnaHQgLyAyKTtcblxuICAgICAgICBjYW52YXNfZWwuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBjYW52YXNfZWwud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXNfZWwuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IEdMT0JBTFMuc2V0dGluZ3MuYm9yZGVyX3dpZHRoO1xuXG4gICAgICAgIGlmIChtb2RlID09ICdpbmFjdGl2ZScpIHtcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI0NDQyc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmcm9tIHRvcCB0byB0aXRsZVxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHNpZGViYXJfaGFsZl93aWR0aCwgbGluZV9tYXJnaW4pO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhcbiAgICAgICAgICAgIHNpZGViYXJfaGFsZl93aWR0aCxcbiAgICAgICAgICAgIChzZWN0aW9uX2hhbGZfaGVpZ2h0IC0gNSAtIGxpbmVfbWFyZ2luKVxuICAgICAgICApO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgIC8vIGZyb20gdGl0bGUgdG8gYm90dG9tXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQubW92ZVRvKFxuICAgICAgICAgICAgc2lkZWJhcl9oYWxmX3dpZHRoLFxuICAgICAgICAgICAgc2VjdGlvbl9oYWxmX2hlaWdodCArIDUgKyBsaW5lX21hcmdpblxuICAgICAgICApO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhcbiAgICAgICAgICAgIHNpZGViYXJfaGFsZl93aWR0aCxcbiAgICAgICAgICAgIChoZWlnaHQgLSBsaW5lX21hcmdpbilcbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAvLyBmcm9tIHRvcCB0byByaWdodFxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzaWRlYmFyX2hhbGZfd2lkdGgsIGxpbmVfbWFyZ2luKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8od2lkdGggLSA1LCBsaW5lX21hcmdpbik7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgLy8gZnJvbSBib3R0b20gdG8gcmlnaHRcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oXG4gICAgICAgICAgICBzaWRlYmFyX2hhbGZfd2lkdGgsXG4gICAgICAgICAgICAoaGVpZ2h0IC0gbGluZV9tYXJnaW4pXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKFxuICAgICAgICAgICAgd2lkdGggLSA1LFxuICAgICAgICAgICAgKGhlaWdodCAtIGxpbmVfbWFyZ2luKVxuICAgICAgICApO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgfSxcblxuICAgIHJlbmRlckxldHRlckVkaXQ6IGZ1bmN0aW9uKG1vZGUpIHtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5nZXQoJ3NlY3Rpb24nKS5nZXQoJ2xpbmVzJykuZWFjaChmdW5jdGlvbihsaW5lKSB7XG5cbiAgICAgICAgICAgIHZhciBsZXR0ZXJfZWwgPSAkKHRoYXQuc2lkZWJhcl90ZW1wbGF0ZSh7XG4gICAgICAgICAgICAgICAgbW9kZTogbW9kZSxcbiAgICAgICAgICAgICAgICBsaW5lX251bWJlcjogbGluZS5nZXQoJ251bWJlcicpLFxuICAgICAgICAgICAgICAgIGxldHRlcjogbGluZS5nZXQoJ2xldHRlcicpLFxuICAgICAgICAgICAgICAgIGhlaWdodDogR0xPQkFMUy5zZXR0aW5ncy5ib3hfaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiBHTE9CQUxTLnNldHRpbmdzLnNlY3Rpb25fc2lkZWJhcl93aWR0aFxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICB0aGF0LiRlbC5hcHBlbmQobGV0dGVyX2VsKTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlcik7XG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgaDEnOiAndG9nZ2xlJyxcbiAgICAgICAgJ2tleXVwIC5zb25nLW5hbWUtaW5wdXQnOiAndXBkYXRlU29uZ05hbWUnXG4gICAgfSxcblxuICAgIHRvZ2dsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCd2aXNpYmxlJywgIXRoaXMubW9kZWwuZ2V0KCd2aXNpYmxlJykpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGVsLmdldCgndmlzaWJsZScpKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcuc29uZy1uYW1lLWNoYW5nZScpLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNUZXh0RmllbGQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5zb25nLW5hbWUtY2hhbmdlJykuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgZm9jdXNUZXh0RmllbGQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBzb25nX25hbWVfaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcuc29uZy1uYW1lLWlucHV0Jyk7XG5cbiAgICAgICAgLy8gc2V0IGZvY3VzIG9uIHRleHQgZmllbGRcbiAgICAgICAgc29uZ19uYW1lX2lucHV0LmZvY3VzKCk7XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSBjdXJzb3IgaXMgYXQgdGhlIGVuZFxuICAgICAgICB2YXIgb3JpZ192YWx1ZSA9IHNvbmdfbmFtZV9pbnB1dC52YWwoKTtcbiAgICAgICAgc29uZ19uYW1lX2lucHV0LnZhbCgnJyk7XG4gICAgICAgIHNvbmdfbmFtZV9pbnB1dC52YWwob3JpZ192YWx1ZSk7XG5cbiAgICB9LFxuXG4gICAgdXBkYXRlU29uZ05hbWU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBzb25nX25hbWUgPSB0aGlzLiRlbC5maW5kKCcuc29uZy1uYW1lLWlucHV0JykudmFsKCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ21vZGVsIHVybDonKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5tb2RlbC51cmwpO1xuICAgICAgICB0aGlzLm1vZGVsLnNldCgnc29uZ19uYW1lJywgc29uZ19uYW1lKTtcbiAgICAgICAgdGhpcy5tb2RlbC5zYXZlKCk7XG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnaDEgc3BhbicpLnRleHQoc29uZ19uYW1lKTtcblxuICAgIH1cblxufSk7XG4iLCJ2YXIgQ2hhcnRUcmFuc3Bvc2UgPSByZXF1aXJlKCcuLi9tb2RlbHMvY2hhcnRfdHJhbnNwb3NlLmpzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCAnY2hhbmdlJywgdGhpcy5yZW5kZXIpO1xuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIC5jbG9zZWQnOiAndG9nZ2xlJyxcbiAgICAgICAgJ2NsaWNrIC5vcGVuIC5jdXJyZW50LWtleSc6ICd0b2dnbGUnLFxuICAgICAgICAnY2xpY2sgLmtleS10b25pY3MgbGkgYSc6ICdjaGFuZ2VLZXknXG4gICAgfSxcblxuICAgIHRvZ2dsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCd2aXNpYmxlJywgIXRoaXMubW9kZWwuZ2V0KCd2aXNpYmxlJykpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGVsLmdldCgndmlzaWJsZScpKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcub3BlbicpLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5vcGVuJykuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZWwuaGFzKCdrZXknKSkge1xuXG4gICAgICAgICAgICB2YXIga2V5ID0gdGhpcy5tb2RlbC5nZXQoJ2tleScpO1xuXG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcua2V5LW5hbWUnKS5odG1sKGtleS5nZXQoJ25hbWUnKSk7XG5cbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5rZXktdG9uaWNzIGxpJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKFxuICAgICAgICAgICAgICAgICcua2V5LXRvbmljcyBsaVtkYXRhLWtleS10b25pYz0nICtcbiAgICAgICAgICAgICAgICAgICAga2V5LmdldCgndG9uaWMnKSArXG4gICAgICAgICAgICAgICAgJ10nXG4gICAgICAgICAgICApLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBjaGFuZ2VLZXk6IGZ1bmN0aW9uKGVsKSB7XG5cbiAgICAgICAgaWYgKCFHTE9CQUxTLmVkaXQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGVsLnRhcmdldCk7XG5cbiAgICAgICAgbmV3IENoYXJ0VHJhbnNwb3NlKHtcbiAgICAgICAgICAgIHRvbmljOiB0YXJnZXQucGFyZW50KCkuZGF0YSgna2V5LXRvbmljJylcbiAgICAgICAgfSkuc2F2ZShudWxsLCB7IHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gUmVmcmVzaCB0aGUgcGFnZSBzbyB0aGF0IHRoZSB0cmFuc3Bvc2l0aW9uIHdpbGxcbiAgICAgICAgICAgIC8vIGJlIHZpc2libGUgb24gdGhlIHNjcmVlbi4gQSBzaW1wbGUgc29sdXRpb24gZm9yXG4gICAgICAgICAgICAvLyBub3cuIFdlIGRvbid0IHdhbnQgdG8gcHV0IHRoZSB0b25pYyBpbiB0aGUgVVJMXG4gICAgICAgICAgICAvLyBiZWNhdXNlOlxuICAgICAgICAgICAgLy8gSWYgeW91IGNoYW5nZSB0aGUga2V5IG9mIHRoZSBmaXJzdCBzZWN0aW9uLCB5b3VcbiAgICAgICAgICAgIC8vIHRodXMgY2hhbmdlIHRoZSBrZXkgZm9yIHRoZSBjb21wbGV0ZSBjaGFydCwgaWZcbiAgICAgICAgICAgIC8vIHRoZSBrZXkgd291bGQgYmUgaW4gdGhlIFVSTCBhbmQgeW91IHdvdWxkIHJlZnJlc2hcbiAgICAgICAgICAgIC8vIHRoZSBwYWdlLCB5b3Ugd291bGQgdHJhbnNwb3NlIHRoZSBjaGFydCBhZ2FpbixcbiAgICAgICAgICAgIC8vIHdoaWNoIGlzIG5vdCB3aGF0IHlvdSB3YW50LlxuICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgIH19KTtcblxuICAgIH1cblxufSk7XG4iLCJ2YXIgTm90ZSA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCgpO1xuXG52YXIgTm90ZXMgPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IE5vdGVcbn0pO1xuXG52YXIgS2V5ID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmluaXREYXRhKCk7XG4gICAgfSxcblxuICAgIGluaXREYXRhOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBPbmx5IHNldCBub3RlcyBpZiBpdCBoYXNuJ3QgYmVlbiBzZXQgeWV0LiBQcmV2ZW50cyBlcnJvcnNcbiAgICAgICAgLy8gd2hlbiBjbG9uaW5nLlxuICAgICAgICBpZighKHRoaXMuZ2V0KCdub3RlcycpIGluc3RhbmNlb2YgQmFja2JvbmUuQ29sbGVjdGlvbikpIHtcblxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIG5vdGVzID0gbmV3IE5vdGVzKCk7XG5cbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLmdldCgnbm90ZXMnKSwgZnVuY3Rpb24obm90ZV9kYXRhKSB7XG4gICAgICAgICAgICAgICAgbm90ZV9kYXRhLmtleSA9IHRoYXQ7XG4gICAgICAgICAgICAgICAgbm90ZXMucHVzaChub3RlX2RhdGEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0KCdub3RlcycsIG5vdGVzKTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBub3RlIG9mIHRoaXMga2V5IGF0IGBkaXN0YW5jZV9mcm9tX3Jvb3RgLlxuICAgICAqL1xuICAgIG5vdGU6IGZ1bmN0aW9uKGRpc3RhbmNlX2Zyb21fcm9vdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJ25vdGVzJykuZmluZFdoZXJlKHtcbiAgICAgICAgICAgIGRpc3RhbmNlX2Zyb21fcm9vdDogZGlzdGFuY2VfZnJvbV9yb290XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbn0pO1xuXG52YXIgS2V5cyA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogS2V5XG59KTtcblxudmFyIGtleXMgPSBuZXcgS2V5cygpO1xuXG5fLmVhY2goR0xPQkFMUy5hbGxfa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAga2V5cy5hZGQoa2V5KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgYWxsS2V5cyA9IHJlcXVpcmUoJy4vYWxsX2tleXMuanMnKTtcblxuXG5mdW5jdGlvbiBLZXlTZWxlY3Qoa2V5X3NlbGVjdF9lbCwgZGVsZWdhdGUpIHtcblxuICAgIHRoaXMua2V5X3NlbGVjdF9lbCA9IGtleV9zZWxlY3RfZWw7XG4gICAgdGhpcy5kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xuXG4gICAgdGhpcy50b25pYyA9ICdDJztcbiAgICB0aGlzLnRvbmFsaXR5ID0gMTtcblxuICAgIHRoaXMudG9uaWNfZWwgPSB0aGlzLmtleV9zZWxlY3RfZWwuZmluZCgnLnRvbmljJyk7XG4gICAgdGhpcy50b25pY19jdXJyZW50bHlfc2VsZWN0ZWRfZWwgPSB0aGlzLnRvbmljX2VsLmZpbmQoJy5jdXJyZW50bHktc2VsZWN0ZWQnKTtcbiAgICB0aGlzLnRvbmljX2Nob2ljZXNfZWwgPSB0aGlzLnRvbmljX2VsLmZpbmQoJy50b25pYy1jaG9pY2VzJyk7XG4gICAgdGhpcy50b25hbGl0eV9lbCA9IHRoaXMua2V5X3NlbGVjdF9lbC5maW5kKCcudG9uYWxpdHknKTtcbiAgICB0aGlzLnRvbmFsaXR5X3RleHRfZWwgPSB0aGlzLnRvbmFsaXR5X2VsLmZpbmQoJ3NwYW4nKTtcblxuICAgIHRoaXMuaW5pdEtleVRvbmljKCk7XG4gICAgdGhpcy5pbml0S2V5VG9uYWxpdHkoKTtcblxuICAgIHJldHVybiB0aGlzO1xuXG59XG5cbktleVNlbGVjdC5wcm90b3R5cGUuaW5pdEtleVRvbmljID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLnRvbmljX2N1cnJlbnRseV9zZWxlY3RlZF9lbC5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgdGhhdC50b25pY19jaG9pY2VzX2VsLnRvZ2dsZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy50b25pY19lbC5maW5kKCcudG9uaWMtY2hvaWNlcyB1bCBsaScpLmNsaWNrKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciB0b25pYyA9ICQoZWwudGFyZ2V0KS5kYXRhKCd0b25pYycpO1xuICAgICAgICB0aGF0LnVwZGF0ZVRvbmljKHRvbmljKTtcbiAgICAgICAgdGhhdC5ub3RpZnlEZWxlZ2F0ZSgpO1xuICAgIH0pO1xuXG4gICAgJCgnaHRtbCcpLmNsaWNrKGZ1bmN0aW9uKGVsKSB7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgISQoZWwudGFyZ2V0KS5jbG9zZXN0KCcudG9uaWMnKS5sZW5ndGggJiZcbiAgICAgICAgICAgICEkKGVsLnRhcmdldCkuY2xvc2VzdCgnLnRvbmljLWNob2ljZXMnKS5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGF0LnRvbmljX2Nob2ljZXNfZWwuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxufTtcblxuS2V5U2VsZWN0LnByb3RvdHlwZS5pbml0S2V5VG9uYWxpdHkgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMudG9uYWxpdHlfZWwuY2xpY2soZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRvbmFsaXR5O1xuXG4gICAgICAgIGlmICh0aGF0LnRvbmFsaXR5X3RleHRfZWwuaHRtbCgpID09ICdNYWpvcicpIHtcbiAgICAgICAgICAgIHRvbmFsaXR5ID0gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvbmFsaXR5ID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoYXQudXBkYXRlVG9uYWxpdHkodG9uYWxpdHkpO1xuICAgICAgICB0aGF0Lm5vdGlmeURlbGVnYXRlKCk7XG5cbiAgICB9KTtcblxufTtcblxuS2V5U2VsZWN0LnByb3RvdHlwZS51cGRhdGVUb25pYyA9IGZ1bmN0aW9uKHRvbmljKSB7XG5cbiAgICB0aGlzLnRvbmljID0gdG9uaWM7XG4gICAgdGhpcy50b25pY19jdXJyZW50bHlfc2VsZWN0ZWRfZWwuaHRtbCh0aGlzLnRvbmljKTtcblxuICAgIHRoaXMudG9uaWNfY2hvaWNlc19lbC5maW5kKCdsaS5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgIHRoaXMudG9uaWNfY2hvaWNlc19lbC5maW5kKFxuICAgICAgICAnbGlbZGF0YS10b25pYz0nICsgdGhpcy50b25pYyArICddJ1xuICAgICkuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgdGhpcy50b25pY19jaG9pY2VzX2VsLmhpZGUoKTtcblxufTtcblxuS2V5U2VsZWN0LnByb3RvdHlwZS51cGRhdGVLZXkgPSBmdW5jdGlvbihrZXkpIHtcbiAgICB0aGlzLnVwZGF0ZVRvbmljKGtleS5nZXQoJ3RvbmljJykpO1xuICAgIHRoaXMudXBkYXRlVG9uYWxpdHkoa2V5LmdldCgndG9uYWxpdHknKSk7XG59O1xuXG5LZXlTZWxlY3QucHJvdG90eXBlLnVwZGF0ZVRvbmFsaXR5ID0gZnVuY3Rpb24odG9uYWxpdHkpIHtcblxuICAgIHRoaXMudG9uYWxpdHkgPSB0b25hbGl0eTtcblxuICAgIGlmICh0aGlzLnRvbmFsaXR5ID09IDEpIHtcbiAgICAgICAgdG9uYWxpdHlfdGV4dCA9ICdNYWpvcic7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdG9uYWxpdHlfdGV4dCA9ICdNaW5vcic7XG4gICAgfVxuXG4gICAgdGhpcy50b25hbGl0eV90ZXh0X2VsLmh0bWwodG9uYWxpdHlfdGV4dCk7XG5cbn07XG5cbktleVNlbGVjdC5wcm90b3R5cGUubm90aWZ5RGVsZWdhdGUgPSBmdW5jdGlvbigpIHtcblxuICAgIGlmICh0aGlzLmRlbGVnYXRlKSB7XG5cbiAgICAgICAgdGhpcy5kZWxlZ2F0ZS5rZXlfY2hhbmdlZChcbiAgICAgICAgICAgIGFsbEtleXMuZmluZFdoZXJlKHtcbiAgICAgICAgICAgICAgICB0b25pYzogdGhpcy50b25pYyxcbiAgICAgICAgICAgICAgICB0b25hbGl0eTogdGhpcy50b25hbGl0eVxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXlTZWxlY3Q7XG4iLCJmdW5jdGlvbiBNZWFzdXJlKFxuICAgIG1lYXN1cmVfZWwsXG4gICAgYmVhdF9zY2hlbWEsXG4gICAgYm94X3dpZHRoLFxuICAgIGJveF9oZWlnaHQsXG4gICAgYm9yZGVyX3dpZHRoXG4pIHtcblxuICAgIHRoaXMubWVhc3VyZV9lbCA9IG1lYXN1cmVfZWw7XG4gICAgdGhpcy5iZWF0X3NjaGVtYSA9IGJlYXRfc2NoZW1hO1xuICAgIHRoaXMuYm94X3dpZHRoID0gYm94X3dpZHRoO1xuICAgIHRoaXMuYm94X2hlaWdodCA9IGJveF9oZWlnaHQ7XG4gICAgdGhpcy5ib3JkZXJfd2lkdGggPSBib3JkZXJfd2lkdGg7XG5cbiAgICByZXR1cm4gdGhpcztcblxufVxuXG5NZWFzdXJlLnByb3RvdHlwZS5tZWFzdXJlX2RyYXdfc2VwYXJhdGlvbl9saW5lcyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGNhbnZhcztcbiAgICB2YXIgY29udGV4dDtcblxuICAgIHN3aXRjaCh0aGlzLmJlYXRfc2NoZW1hKSB7XG5cbiAgICAgICAgY2FzZSAnMi0yJzpcblxuICAgICAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSB0aGlzLmJveF93aWR0aDtcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aGlzLmJveF9oZWlnaHQ7XG5cbiAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gdGhpcy5ib3JkZXJfd2lkdGg7XG5cbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyh0aGlzLmJveF93aWR0aCwgMCk7XG4gICAgICAgICAgICBjb250ZXh0LmxpbmVUbygwLCB0aGlzLmJveF9oZWlnaHQpO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICAgdGhpcy5tZWFzdXJlX2VsLnByZXBlbmQoY2FudmFzKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnMi0xLTEnOlxuXG4gICAgICAgICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAgICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHRoaXMuYm94X3dpZHRoO1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMuYm94X2hlaWdodDtcblxuICAgICAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmJvcmRlcl93aWR0aDtcblxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKHRoaXMuYm94X3dpZHRoLCAwKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKDAsIHRoaXMuYm94X2hlaWdodCk7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8odGhpcy5ib3hfd2lkdGggLyAyLCB0aGlzLmJveF9oZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHRoaXMuYm94X3dpZHRoLCB0aGlzLmJveF9oZWlnaHQpO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICAgdGhpcy5tZWFzdXJlX2VsLnByZXBlbmQoY2FudmFzKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnMS0xLTInOlxuXG4gICAgICAgICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAgICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHRoaXMuYm94X3dpZHRoO1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMuYm94X2hlaWdodDtcblxuICAgICAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmJvcmRlcl93aWR0aDtcblxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKHRoaXMuYm94X3dpZHRoLCAwKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKDAsIHRoaXMuYm94X2hlaWdodCk7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oMCwgMCk7XG4gICAgICAgICAgICBjb250ZXh0LmxpbmVUbyh0aGlzLmJveF93aWR0aCAvIDIsIHRoaXMuYm94X2hlaWdodCAvIDIpO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICAgdGhpcy5tZWFzdXJlX2VsLnByZXBlbmQoY2FudmFzKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnMS0xLTEtMSc6XG5cbiAgICAgICAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdGhpcy5ib3hfd2lkdGg7XG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5ib3hfaGVpZ2h0O1xuXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuYm9yZGVyX3dpZHRoO1xuXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8odGhpcy5ib3hfd2lkdGgsIDApO1xuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oMCwgdGhpcy5ib3hfaGVpZ2h0KTtcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0Lm1vdmVUbygwLCAwKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHRoaXMuYm94X3dpZHRoLCB0aGlzLmJveF9oZWlnaHQpO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICAgdGhpcy5tZWFzdXJlX2VsLnByZXBlbmQoY2FudmFzKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVhc3VyZTtcbiJdfQ==
