(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MeasureWidget = require('./widgets/measure.js');

$('.how-to-read .measures .measures .measure').each(function() {

    var measure = $(this);

    new MeasureWidget(measure, measure.data('beatschema'), 100, 100, 1)
        .measure_draw_separation_lines();

});

},{"./widgets/measure.js":2}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvZW52L2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9SaWsvZGV2L2phenpjaG9yZHMvc3JjL3N0YXRpYy9qcy9hcHBzL2Nob3JkY2hhcnRzL2hvd190b19yZWFkLmpzIiwiL1VzZXJzL1Jpay9kZXYvamF6emNob3Jkcy9zcmMvc3RhdGljL2pzL2FwcHMvY2hvcmRjaGFydHMvd2lkZ2V0cy9tZWFzdXJlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIE1lYXN1cmVXaWRnZXQgPSByZXF1aXJlKCcuL3dpZGdldHMvbWVhc3VyZS5qcycpO1xuXG4kKCcuaG93LXRvLXJlYWQgLm1lYXN1cmVzIC5tZWFzdXJlcyAubWVhc3VyZScpLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbWVhc3VyZSA9ICQodGhpcyk7XG5cbiAgICBuZXcgTWVhc3VyZVdpZGdldChtZWFzdXJlLCBtZWFzdXJlLmRhdGEoJ2JlYXRzY2hlbWEnKSwgMTAwLCAxMDAsIDEpXG4gICAgICAgIC5tZWFzdXJlX2RyYXdfc2VwYXJhdGlvbl9saW5lcygpO1xuXG59KTtcbiIsImZ1bmN0aW9uIE1lYXN1cmUoXG4gICAgbWVhc3VyZV9lbCxcbiAgICBiZWF0X3NjaGVtYSxcbiAgICBib3hfd2lkdGgsXG4gICAgYm94X2hlaWdodCxcbiAgICBib3JkZXJfd2lkdGhcbikge1xuXG4gICAgdGhpcy5tZWFzdXJlX2VsID0gbWVhc3VyZV9lbDtcbiAgICB0aGlzLmJlYXRfc2NoZW1hID0gYmVhdF9zY2hlbWE7XG4gICAgdGhpcy5ib3hfd2lkdGggPSBib3hfd2lkdGg7XG4gICAgdGhpcy5ib3hfaGVpZ2h0ID0gYm94X2hlaWdodDtcbiAgICB0aGlzLmJvcmRlcl93aWR0aCA9IGJvcmRlcl93aWR0aDtcblxuICAgIHJldHVybiB0aGlzO1xuXG59XG5cbk1lYXN1cmUucHJvdG90eXBlLm1lYXN1cmVfZHJhd19zZXBhcmF0aW9uX2xpbmVzID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgY2FudmFzO1xuICAgIHZhciBjb250ZXh0O1xuXG4gICAgc3dpdGNoKHRoaXMuYmVhdF9zY2hlbWEpIHtcblxuICAgICAgICBjYXNlICcyLTInOlxuXG4gICAgICAgICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAgICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHRoaXMuYm94X3dpZHRoO1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMuYm94X2hlaWdodDtcblxuICAgICAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmJvcmRlcl93aWR0aDtcblxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKHRoaXMuYm94X3dpZHRoLCAwKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKDAsIHRoaXMuYm94X2hlaWdodCk7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICB0aGlzLm1lYXN1cmVfZWwucHJlcGVuZChjYW52YXMpO1xuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICcyLTEtMSc6XG5cbiAgICAgICAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdGhpcy5ib3hfd2lkdGg7XG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5ib3hfaGVpZ2h0O1xuXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuYm9yZGVyX3dpZHRoO1xuXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8odGhpcy5ib3hfd2lkdGgsIDApO1xuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oMCwgdGhpcy5ib3hfaGVpZ2h0KTtcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyh0aGlzLmJveF93aWR0aCAvIDIsIHRoaXMuYm94X2hlaWdodCAvIDIpO1xuICAgICAgICAgICAgY29udGV4dC5saW5lVG8odGhpcy5ib3hfd2lkdGgsIHRoaXMuYm94X2hlaWdodCk7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICB0aGlzLm1lYXN1cmVfZWwucHJlcGVuZChjYW52YXMpO1xuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICcxLTEtMic6XG5cbiAgICAgICAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgICAgICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdGhpcy5ib3hfd2lkdGg7XG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5ib3hfaGVpZ2h0O1xuXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuYm9yZGVyX3dpZHRoO1xuXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8odGhpcy5ib3hfd2lkdGgsIDApO1xuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oMCwgdGhpcy5ib3hfaGVpZ2h0KTtcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0Lm1vdmVUbygwLCAwKTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHRoaXMuYm94X3dpZHRoIC8gMiwgdGhpcy5ib3hfaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICB0aGlzLm1lYXN1cmVfZWwucHJlcGVuZChjYW52YXMpO1xuXG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICcxLTEtMS0xJzpcblxuICAgICAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSB0aGlzLmJveF93aWR0aDtcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aGlzLmJveF9oZWlnaHQ7XG5cbiAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gdGhpcy5ib3JkZXJfd2lkdGg7XG5cbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyh0aGlzLmJveF93aWR0aCwgMCk7XG4gICAgICAgICAgICBjb250ZXh0LmxpbmVUbygwLCB0aGlzLmJveF9oZWlnaHQpO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKDAsIDApO1xuICAgICAgICAgICAgY29udGV4dC5saW5lVG8odGhpcy5ib3hfd2lkdGgsIHRoaXMuYm94X2hlaWdodCk7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgICAgICB0aGlzLm1lYXN1cmVfZWwucHJlcGVuZChjYW52YXMpO1xuXG4gICAgICAgICAgICBicmVhaztcblxuICAgIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZWFzdXJlO1xuIl19
