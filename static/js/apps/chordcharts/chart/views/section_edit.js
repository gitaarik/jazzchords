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
