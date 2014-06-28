define(function() {

    function KeySelect(key_select_el, delegate) {

        this.key_select_el = key_select_el;
        this.tonic_el = this.key_select_el.find('.tonic');
        this.tonic_currently_selected_el = this.tonic_el.find('.currently-selected');
        this.tonic_choices_el = this.tonic_el.find('.tonic-choices');
        this.tonality_el = this.key_select_el.find('.tonality');
        this.tonality_text_el = this.tonality_el.find('span');

        this.delegate = delegate;

        this.initKeyTonic();
        this.initKeyTonality();

        return this;

    }

    KeySelect.prototype.initKeyTonic = function() {

        var that = this;

        this.tonic_currently_selected_el.click(function() {
            that.tonic_choices_el.toggle();
        });

        this.tonic_el.find('.tonic-choices ul li').click(function(el) {
            var tonic = $(el.target).data('tonic');
            that.updateTonic(tonic);
            that.delegate.tonic_changed(tonic);
        });

        $('html').click(function(el) {

            if (
                !$(el.target).closest('.tonic').length &&
                !$(el.target).closest('.tonic-choices').length
            ) {
                that.tonic_choices_el.hide();
            }

        });

    };

    KeySelect.prototype.initKeyTonality = function() {

        var that = this;

        this.tonality_el.click(function() {

            var tonality;

            if (that.tonality_text_el.html() == 'Major') {
                tonality = 'Minor';
            } else {
                tonality = 'Major';
            }

            that.updateTonality(tonality);
            that.delegate.tonality_changed(tonality);

        });

    };

    KeySelect.prototype.updateTonic = function(tonic) {

        this.tonic_currently_selected_el.html(tonic);

        this.tonic_choices_el.find('li.selected').removeClass('selected');
        this.tonic_choices_el.find('li[data-tonic=' + tonic + ']').addClass('selected');
        this.tonic_choices_el.hide();

    };

    KeySelect.prototype.updateTonality = function(tonality) {

        tonality = tonality.toLowerCase();

        if (tonality == 'major') {
            tonality_text = 'Major';
        } else if (tonality == 'minor') {
            tonality_text = 'Minor';
        } else {
            return false;
        }

        this.tonality_text_el.html(tonality_text);

    };

    return KeySelect;

});
