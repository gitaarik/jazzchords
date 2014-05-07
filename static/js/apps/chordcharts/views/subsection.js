define(
    ['models/line', 'views/line'],
    function(Line, LineView) {

        return Backbone.View.extend({

            tagName: 'tbody',
            className: 'subsection',

            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model.get('lines'), 'add', this.render);
                this.listenTo(this.model.get('lines'), 'remove', this.render);
            },

            render: function() {
                this.renderLines();
                return this;
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

                this.$el.html('');
                this.$el.append(lineViews);

            }

        });

    }
);
