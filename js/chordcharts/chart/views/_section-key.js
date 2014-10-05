var Section = require('../models/_section.js');
var SectionKey = require('../models/_section-key.js');
var transposeWidget = require('../init/_transpose-widget.js');
var KeySelectWidget = require('../../../core/widgets/_key-select.js');


module.exports = Backbone.View.extend({

    model: Section,

    events: {
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
            'top': this.model.get('offset').top + 36,
            'left': this.model.get('offset').left - 30
        });

        this.keySelectWidget.updateKey(
            this.model.get('section').get('key')
        );

        this.$el.show();

    },

    updateKey: function(new_key) {

        this.model.get('section').updateKey(new_key);
        new SectionKey({ section: this.model.get('section') }).save();

        if (this.model.get('section').get('number') == 1) {
            transposeWidget.set('key', new_key);
        }

    }

});
