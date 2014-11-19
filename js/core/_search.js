var Search = function() {

    var that = this;
    this.search_el_sel = '._base-header .search';
    this.search_el = $(this.search_el_sel);
    this.search_form_el = this.search_el.find('.search-form');
    this.search_term_el = this.search_form_el.find('.search-term');
    this.search_term_input_el = this.search_term_el.find('.search-term-input');
    this.search_results_el = this.search_el.find('.search-results');

    this.search_term;
    this.last_search_term_input_value = '';
    this.search_results = {};
    this.tab_pressed = false;
    this.selected_result_index;
    this.results_cache = {};

    this.search_term_input_el.focus(function() {
        that.search_el.addClass('focussed');
        that.show_search_results();
    });

    $(window).click(function(event) {
        if ($(event.target).closest(that.search_el_sel).length == 0) {
            that.hide_search_results()
            that.search_el.removeClass('focussed');
        }
    });

    this.search_term_input_el.on('keydown', function(event) {
        if ($.inArray(event.key, ['Esc', 'Escape']) > -1) {
            that.hide_search_results();
            that.selected_result_index = null;
            that.search_term_input_el.val(that.search_term);
            return false;
        }
    });

    this.search_term_input_el.on('keyup', function(event) {

        if ($.inArray(event.key, ['Down', 'ArrowDown']) > -1) {
            that.select_result_with_offset(1);
        } else if ($.inArray(event.key, ['Up', 'ArrowUp']) > -1) {
            that.select_result_with_offset(-1);
        } else if ($.inArray(event.key, ['Esc', 'Escape']) > -1) {
            that.search_term_input_el.val(that.search_term);
        } else {
            that.process_search_term();
        }

    });

    this.search_term_el.find('.before-search-term').focus(function() {
        that.tab_pressed = true;
        that.select_result_with_offset(-1);
        that.search_term_input_el.focus();
    });

    this.search_term_el.find('.behind-search-term').focus(function() {
        that.tab_pressed = true;
        that.select_result_with_offset(1);
        that.search_term_input_el.focus();
    });

    this.search_results_el.mousemove(function(event) {

        var result_el = $(event.target).closest('li');

        if (result_el.length) {
            that.select_result(result_el.index('li'), false, false);
        }

    });

    this.search_el.mouseleave(function() {
        if (!that.search_term_input_el.is(':focus')) {
            that.hide_search_results();
        }
    });

    this.search_form_el.submit(function() {
        that.open_result();
        return false;
    });

};

/**
 * Processes the results for the current search term if it was changed
 * since last time.
 */
Search.prototype.process_search_term = function() {

    var new_search_term_input_value = this.search_term_input_el.val().trim();

    if (this.last_search_term_input_value != new_search_term_input_value) {
        this.search_term = new_search_term_input_value;
        this.process_results();
        this.last_search_term_input_value = new_search_term_input_value;
    }

};

/**
 * Gets the results for the current search term and processes them into
 * the results widget.
 */
Search.prototype.process_results = function() {

    var that = this;

    if (this.search_term) {

        this.show_loading_indicator();

        $.get(
            '/api/chordcharts/search/?search-term=' + this.search_term,
            function(response) {

                var result_els = [];
                that.search_results = response.results;

                if (that.search_results.length) {

                    var result;

                    for (var i = 0; i < that.search_results.length; i++) {
                        result = that.search_results[i];
                        result_els.push(
                            '<li><a href="' + result.url + '">' +
                                result.song_name +
                            '</a></li>'
                        );
                    }

                    that.search_results_el.html(result_els.join(''));
                    that.show_search_results();
                    that.selected_result_index = null;

                    if (that.search_results.length == 1) {
                        that.select_result(0, false);
                    }

                } else {
                    that.show_no_results_message();
                }

            }
        );

    } else {
        this.search_results_el.html('');
        this.search_el.removeClass('results-on');
    }

};

Search.prototype.show_loading_indicator = function() {
    this.search_results_el.html('<li><span>Loading...</span></li>');
    this.search_el.addClass('results-on');
};

/**
 * Shows a message in the results box saying there were no search
 * results found.
 */
Search.prototype.show_no_results_message = function() {
    this.search_results_el.html('<li><span>No charts found</span></li>');
    this.search_el.addClass('results-on');
};

/**
 * Shows the results widget if there are any results.
 */
Search.prototype.show_search_results = function() {
    if (this.search_results.length) {
        this.search_el.addClass('results-on');
    }
};

/**
 * Hides the results widget.
 */
Search.prototype.hide_search_results = function() {

    var that = this;

    setTimeout(function() {
        if (!that.tab_pressed) {
            that.search_el.removeClass('results-on');
        } else {
            that.tab_pressed = false;
        }
    }, 0);

};

Search.prototype.select_result_with_offset = function(offset, autocomplete_input) {

    var index = this.selected_result_index;

    if (index == null) {

        if (offset > 0) {
            index = offset - 1;
        } else {
            index = this.search_results.length - 1;
        }

    } else {

        index += offset;

        if (index < 0) {
            index = null;
        }

        if (index >= this.search_results.length) {
            index = null;
        }

    }

    this.show_search_results();
    this.select_result(index);

}

/**
 * Selects the resuls with the given `offset` relative to the currently
 * selected result.
 */
Search.prototype.select_result = function(index, autocomplete_input, update_index) {

    if (update_index == null || update_index) {
        this.selected_result_index = index;
    }

    if (autocomplete_input == null) {
        autocomplete_input = true;
    }

    if (this.search_results.length) {

        var all_search_result_elements = this.search_results_el.find('li');
        all_search_result_elements.removeClass('selected');

        if (index == null) {
            this.search_term_input_el.val(this.search_term);
        } else {

            var selected_search_result_song_name = (
                this.search_results[index].song_name
            );

            if (autocomplete_input) {
                this.search_term_input_el.val(selected_search_result_song_name);
            }

            this.last_search_term_input_value = selected_search_result_song_name;
            var selected_search_result_el = all_search_result_elements.eq(index);
            selected_search_result_el.addClass('selected');

        }

    }

};

/**
 * Opens the selected search result.
 */
Search.prototype.open_result = function() {

    var that = this;

    if (this.search_results.length) {

        var open_result;

        if (this.search_results.length == 1) {
            open_result = this.search_results[0];
        } else if (this.selected_result_index != null) {
            open_result = this.search_results[
                this.selected_result_index
            ];
        }

        if (open_result) {
            window.location = open_result.url;
        } else {
            this.search_term_input_el.focus();
            this.search_results_el.addClass('attention-animation');
            setTimeout(function() {
                that.search_results_el.removeClass('attention-animation');
            }, 1000);
        }

    }

};

$(function() {
    new Search();
});
