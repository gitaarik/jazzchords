var Search = function() {

    var that = this;
    this.search_el = $('._base-header .search');
    this.search_term_el = this.search_el.find('.search-term');
    this.search_term_input_el = this.search_term_el.find('.search-term-input');
    this.search_results_el = this.search_el.find('.search-results');

    this.search_term;
    this.last_search_term_input_value = '';
    this.search_results = {};
    this.tab_pressed = false;
    this.selected_search_result_index;

    this.search_term_input_el.focus(function() {
        that.search_el.addClass('focussed');
        that.search_term_changed();
    });

    this.search_term_input_el.focusout(function() {
        that.hide_search_results()
    });

    this.search_term_input_el.on('keyup', function() {
        that.search_term_changed();
    });

    this.search_term_el.find('.before-search-term').focus(function() {
        that.tab_pressed = true;
        that.select_result(-1);
        that.search_term_input_el.focus();
    });

    this.search_term_el.find('.behind-search-term').focus(function() {
        that.tab_pressed = true;
        that.select_result(1);
        that.search_term_input_el.focus();
    });

}

Search.prototype.search_term_changed = function() {

    var new_search_term_input_value = (
        this.search_term_input_el.val().trim()
    );

    if (this.last_search_term_input_value != new_search_term_input_value) {
        this.search_term = new_search_term_input_value;
        this.show_search_results();
        this.last_search_term_input_value = new_search_term_input_value;
    }

};

Search.prototype.show_search_results = function() {

    var that = this;

    if (this.search_term) {

        $.get(
            '/api/chordcharts/search/?search-term=' + this.search_term,
            function(response) {

                var result_els = [];
                that.search_results = response.results;

                for (var i = 0; i < that.search_results.length; i++) {
                    result_els.push(
                        '<li>' + that.search_results[i].song_name + '</li>'
                    );
                }

                if (result_els.length) {
                    that.search_results_el.html(result_els.join(''));
                    that.search_el.addClass('results-on');
                    that.selected_search_result_index = null;
                } else {
                    that.search_el.removeClass('results-on');
                }

            }
        );

    } else {
        this.search_results_el.html('');
        this.search_el.removeClass('results-on');
    }

}

Search.prototype.hide_search_results = function() {

    var that = this;

    setTimeout(function() {
        if (!that.tab_pressed) {
            that.search_el.removeClass('focussed');
            that.search_el.removeClass('results-on');
        } else {
            that.tab_pressed = false;
        }
    }, 0);

}

Search.prototype.select_result = function(offset) {

    if (this.search_results.length) {

        this.reinit_selected_search_result_index(offset);

        if (this.selected_search_result_index == null) {
            this.search_term_input_el.val(this.search_term);
        } else {

            var selected_search_result_song_name = (
                this.search_results[this.selected_search_result_index].song_name
            );

            this.search_term_input_el.val(selected_search_result_song_name);
            this.last_search_term_input_value = selected_search_result_song_name;

            var all_search_result_elements = this.search_results_el.find('li');
            var selected_search_result_el = (
                all_search_result_elements.eq(
                    this.selected_search_result_index
                )
            );

            all_search_result_elements.removeClass('selected');
            selected_search_result_el.addClass('selected');

        }

    }

}

/**
 * Sets the `selected_search_result_index` for the given `offset`.
 */
Search.prototype.reinit_selected_search_result_index = function(offset) {

    if (this.selected_search_result_index == null) {
        this.selected_search_result_index = offset - 1;
    } else {
        this.selected_search_result_index += offset;
    }

    if (this.selected_search_result_index < 0) {
        this.selected_search_result_index = null;
    }

    if (this.selected_search_result_index >= this.search_results.length) {
        this.selected_search_result_index = this.search_results.length - 1;
    }

}

$(function() {
    new Search();
});
