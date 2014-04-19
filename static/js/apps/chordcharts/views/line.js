define(
    ['views/measure'],
    function(MeasureView) {

        return Backbone.View.extend({

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

                if(this.model.get('measures').length < 8) {
                    this.$el.find('.colspan').attr(
                        'colspan',
                        8 - this.model.get('measures').length
                    );
                }
                else {
                    this.$el.find('.measure-add').remove();
                }

            },

            measureRemoved: function() {

                if(this.model.get('measures').length == 7) {
                    this.addMeasureAddWidget(1);
                }
                else {
                    this.$el.find('.colspan').attr(
                        'colspan',
                        8 - this.model.get('measures').length
                    );
                }

            },

            addMeasureAddWidget: function(colspan) {
                this.$el.append(
                    '<td class="measure-add colspan" colspan="' + colspan + '">' +
                        '<div class="plus">+</div>' +
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

                if(this.$el.find('.measure-add').length) {
                    measureViewEl.insertBefore(
                        this.$el.find('.measure-add')
                    );
                }
                else {
                    this.$el.append(measureViewEl);
                }

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

    }
);
