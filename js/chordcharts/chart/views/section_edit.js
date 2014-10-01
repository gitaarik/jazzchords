var Section = require('../models/section.js');
var SectionKey = require('../models/section_key.js');
var transposeWidget = require('../init/transpose_widget.js');
var KeySelectWidget = require('../../../core/widgets/key_select.js');


module.exports = Backbone.View.extend({

    model: Section,

    events: {
        'keyup .name-input': 'nameChanged',
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

        this.$el.find('.name-input').val(
            this.model.get('section').get('name')
        );

        if (this.model.get('section').get('name')) {
            this.$el.find('.name-radio').prop('checked', true);
        } else {
            this.$el.find('.no-name-radio').prop('checked', true);
        }

        this.keySelectWidget.updateKey(
            this.model.get('section').get('key')
        );

        this.$el.show();

        var name_input = this.$el.find('.name-input');

        // set focus on text field
        name_input.focusAtEnd();

    },

    nameChanged: function(event) {

        this.model.get('section').set(
            'name', 
            this.$el.find('.name-input').val().trim()
        );

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
