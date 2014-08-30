(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
define(['widgets/key_select'], function(KeySelectWidget) {

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

});

},{}]},{},[1])