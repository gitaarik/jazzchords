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

                if (!this.$el.find('.lines').length) {
                    this.$el.append(_.template(
                        $('#template-lines').html()
                    )());
                } else {
                    this.$el.find('.lines tbody').html('');
                }

                this.$el.find('.lines').append(lineViews);

            }

        });

    }
);
