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
