define(function() {

    function KeySelect(key_select_el, delegate) {

        this.key_select_el = key_select_el;
        this.delegate = delegate;

        this.initKeyTonic();
        this.initKeyTonality();

        return this;

    }

    KeySelect.prototype.initKeyTonic = function() {

        var that = this;
        var tonic_el = this.key_select_el.find('.tonic');
        var tonic_currently_selected_el = tonic_el.find('.currently-selected');
        var tonic_choices_el = tonic_el.find('.tonic-choices');

        tonic_currently_selected_el.click(function() {
            tonic_choices_el.toggle();
        });

        tonic_el.find('.tonic-choices ul li').click(function(el) {

            var tonic_chosen = $(el.target).data('tonic');

            tonic_currently_selected_el.html(tonic_chosen);
            tonic_el.find('.tonic-input').attr('value', tonic_chosen);
            that.delegate.tonic_changed(tonic_chosen);

            tonic_choices_el.find('li.selected').removeClass('selected');
            tonic_choices_el.find('li[data-tonic=' + tonic_chosen + ']').addClass('selected');
            tonic_choices_el.hide();

        });

        $('html').click(function(el) {

            if (
                !$(el.target).closest('.tonic').length &&
                !$(el.target).closest('.tonic-choices').length
            ) {
                tonic_choices_el.hide();
            }

        });

    };

    KeySelect.prototype.initKeyTonality = function() {

        var that = this;
        var tonality_el = this.key_select_el.find('.tonality');

        tonality_el.click(function() {

            var tonality;
            var tonality_text_el = tonality_el.find('span');

            if (tonality_text_el.html() == 'Major') {
                tonality = 'Minor';
            } else {
                tonality = 'Major';
            }

            tonality_text_el.html(tonality);
            tonality_el.find('input').attr('value', tonality);
            that.delegate.tonality_changed(tonality);

        });

    };

    return KeySelect;

});
