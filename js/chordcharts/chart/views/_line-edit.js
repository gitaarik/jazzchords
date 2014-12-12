var syncError = require('../init/_sync-error.js');


module.exports = Backbone.View.extend({

    tagName: 'div',
    className: 'line-edit',

    initialize: function() {
        this.initListeners();
    },

    initListeners: function() {
        this.stopListening();
        this.listenTo(this.model, 'change', this.render);
    },

    events: {
        'click .letters li': 'chooseLetter',
        'change input[name=merge-up]': 'mergeUp',
        'change input[name=merge-down]': 'mergeDown',
        'click .disable-sidebar': 'disableSidebar',
        'click .header .close': 'hide'
    },

    render: function() {

        // Only show the edit widget when 'visible' is true,
        // otherwise, hide the edit widget.

        if (this.model.get('visible')) {
            this.show();
        } else {
            this.hide();
        }

        return this;

    },

    show: function() {

        var offset = this.offset();

        this.$el.css({
            top: offset.top,
            left: offset.left
        });

        this.parseLetters();
        this.parseMergeOption();

        this.$el.show();

    },

    parseLetters: function() {

        this.$el.find('.letters li').removeClass('selected');

        this.$el.find(
            '.letters li[' +
                'data-letter=' +
                this.model.get('line').get('letter') +
            ']'
        ).addClass('selected');

    },

    parseMergeOption: function() {

        var this_line = this.model.get('line');
        var prev_line = this.model.get('line').previous();
        var next_line = this.model.get('line').next();

        var merge_up_el = this.$el.find('.merge-up');
        var merge_down_el = this.$el.find('.merge-down');

        if (
            prev_line &&
            prev_line.get('letter') == this_line.get('letter')
        ) {

            if (prev_line.get('merge_with_next_line')) {
                merge_up_el.find('input').prop('checked', true);
            } else {
                merge_up_el.find('input').prop('checked', false);
            }

            merge_up_el.show();

        } else {
            merge_up_el.hide();
        }

        if (
            next_line &&
            next_line.get('letter') == this_line.get('letter')
        ) {

            if (this_line.get('merge_with_next_line')) {
                merge_down_el.find('input').prop('checked', true);
            } else {
                merge_down_el.find('input').prop('checked', false);
            }

            merge_down_el.show();

        } else {
            merge_down_el.hide();
        }

    },

    /**
     * Returns the offset of the widget.
     */
    offset: function() {

        var offset = {
            top: this.model.get('offset').top,
            left: this.model.get('offset').left
        };

        offset.top += GLOBALS.settings.box_height / 2 + 30;
        offset.left += GLOBALS.settings.section_sidebar_width / 2 - 30;

        return offset;

    },

    hide: function() {

        var onClose = this.model.get('onClose');

        if (onClose) {
            // Call `onClose()` callback function if it is
            // defined.
            onClose();
        }

        this.$el.hide();

    },

    chooseLetter: function(event) {

        var letter = event.target.getAttribute('data-letter');
        var line = this.model.get('line');

        line.set('letter', letter);
        line.save().fail(function() {
            syncError.show();
        });

        this.render();
        this.model.get('section_sidebar').trigger('change');

    },

    mergeUp: function(event) {

        var prev_line = this.model.get('line').previous();

        prev_line.set(
            'merge_with_next_line',
            $(event.target).is(':checked')
        );

        prev_line.save().fail(function() {
            syncError.show();
        });

    },

    mergeDown: function(event) {

        var line = this.model.get('line');

        line.set(
            'merge_with_next_line',
            $(event.target).is(':checked')
        );

        line.save().fail(function() {
            syncError.show();
        });

    },

    disableSidebar: function() {

        var section = this.model.get('section');
        section.set('show_sidebar', false);
        section.save().fail(function() {
            syncError.show();
        });

        this.hide();

    }

});
