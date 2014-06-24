define(function() {

    function KeySelect() {

        this.key_select_el = $('.key-select-widget');

        this.initKeyTone();
        this.initKeyTonality();

        return this;

    }

    KeySelect.prototype.initKeyTone = function() {

        var tone_el = this.key_select_el.find('.tone');
        var tone_currently_selected_el = tone_el.find('.currently-selected');
        var tone_choices_el = tone_el.find('.tone-choices');

        tone_currently_selected_el.click(function() {
            tone_choices_el.toggle();
        });

        tone_el.find('.tone-choices ul li').click(function(el) {

            var tone_chosen = $(el.target).data('tone');

            tone_currently_selected_el.html(tone_chosen);
            tone_el.find('.tone-input').attr('value', tone_chosen);

            tone_choices_el.find('li.selected').removeClass('selected');
            tone_choices_el.find('li[data-tone=' + tone_chosen + ']').addClass('selected');
            tone_choices_el.hide();

        });

        $('html').click(function(el) {

            if (
                !$(el.target).closest('.tone').length &&
                !$(el.target).closest('.tone-choices').length
            ) {
                tone_choices_el.hide();
            }

        });

    };

    KeySelect.prototype.initKeyTonality = function() {

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

        });

    };

    return KeySelect;

});
