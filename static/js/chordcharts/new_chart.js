(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var KeySelectWidget = require('../core/widgets/key_select.js');

var keySelectWidgetDelegate = function() {};

keySelectWidgetDelegate.key_changed = function(key) {
    $('.key-tonic-input').prop('value', key.get('tonic'));
    $('.key-tonality-input').prop('value', key.get('tonality'));
};


new KeySelectWidget($('.key-select-widget'), keySelectWidgetDelegate);

this.chart_settings = $('.chart-settings');

this.chart_settings.find('.tooltip-button').mouseover(function() {
    $(this).closest('tr').find('.tooltip-popup').show();
    $(this).closest('tr').addClass('tooltip-highlighted');
});

this.chart_settings.find('.tooltip-button').mouseout(function() {
    $(this).closest('tr').find('.tooltip-popup').hide();
    $(this).closest('tr').removeClass('tooltip-highlighted');
});

},{"../core/widgets/key_select.js":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./all_keys.js":2}]},{},[1])