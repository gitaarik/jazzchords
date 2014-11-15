var Search = function() {

    var that = this;
    this.search_el = $('._base-header .search');
    this.search_form_el = this.search_el.find('.search-form');
    this.search_term_el = this.search_form_el.find('.search-term');
    this.search_term_input_el = this.search_term_el.find('.search-term-input');
    this.search_results_el = this.search_el.find('.search-results');

    this.search_term;
    this.last_search_term_input_value = '';
    this.search_results = {};
    this.tab_pressed = false;
    this.mouse_over_search_results = false;
    this.selected_search_result_index;

    this.search_term_input_el.focus(function() {
        that.search_el.addClass('focussed');
        that.process_search_term();
    });

    this.search_term_input_el.focusout(function() {
        that.hide_search_results()
        that.search_el.removeClass('focussed');
    });

    this.search_term_input_el.on('keyup', function(event) {

        if ($.inArray(event.key, ['Down', 'ArrowDown']) > -1) {
            that.select_result(1);
        } else if ($.inArray(event.key, ['Up', 'ArrowUp']) > -1) {
            that.select_result(-1);
        } else {
            that.process_search_term();
        }

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

    this.search_results_el.mouseenter(function() {
        that.mouse_over_search_results = true;
    });

    this.search_results_el.mouseleave(function() {
        that.mouse_over_search_results = false;
    });

    this.search_el.mouseleave(function() {
        if (!that.search_term_input_el.is(':focus')) {
            that.hide_search_results();
        }
    });

    this.search_form_el.submit(function() {
        that.open_search_result();
        return false;
    });

};

/**
 * Processes the results for the current search term, or shows the
 * results for the current search term if it didn't change since last
 * time this method was called.
 */
Search.prototype.process_search_term = function() {

    var new_search_term_input_value = (
        this.search_term_input_el.val().trim()
    );

    if (this.last_search_term_input_value != new_search_term_input_value) {
        this.search_term = new_search_term_input_value;
        this.process_results();
        this.last_search_term_input_value = new_search_term_input_value;
    } else {
        this.show_search_results();
    }

};

/**
 * Gets the results for the current search term and processes them into
 * the results widget.
 */
Search.prototype.process_results = function() {

    var that = this;

    if (this.search_term) {

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
                    that.selected_search_result_index = null;

                    if (that.search_results.length == 1) {
                        that.select_result(1, false);
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

Search.prototype.show_no_results_message = function() {
    this.search_el.addClass('results-on');
    this.search_results_el.html('<li><span>No charts found</span></li>');
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

    if (!this.mouse_over_search_results) {

        setTimeout(function() {
            if (!that.tab_pressed) {
                that.search_el.removeClass('results-on');
            } else {
                that.tab_pressed = false;
            }
        }, 0);

    }

};

/**
 * Selects the resuls with the given `offset` relative to the currently
 * selected result.
 */
Search.prototype.select_result = function(offset, autocomplete_input) {

    if (autocomplete_input == null) {
        autocomplete_input = true;
    }

    if (this.search_results.length) {

        var all_search_result_elements = this.search_results_el.find('li');
        all_search_result_elements.removeClass('selected');

        this.reinit_selected_search_result_index(offset);

        if (this.selected_search_result_index == null) {
            this.search_term_input_el.val(this.search_term);
        } else {

            var selected_search_result_song_name = (
                this.search_results[this.selected_search_result_index].song_name
            );

            if (autocomplete_input) {
                this.search_term_input_el.val(selected_search_result_song_name);
            }

            this.last_search_term_input_value = selected_search_result_song_name;

            var selected_search_result_el = (
                all_search_result_elements.eq(
                    this.selected_search_result_index
                )
            );

            selected_search_result_el.addClass('selected');

        }

    }

};

/**
 * Sets the `selected_search_result_index` for the given `offset`.
 */
Search.prototype.reinit_selected_search_result_index = function(offset) {

    if (this.selected_search_result_index == null) {

        if (offset > 0) {
            this.selected_search_result_index = offset - 1;
        } else {
            this.selected_search_result_index = this.search_results.length - 1;
        }

    } else {

        this.selected_search_result_index += offset;

        if (this.selected_search_result_index < 0) {
            this.selected_search_result_index = null;
        }

        if (this.selected_search_result_index >= this.search_results.length) {
            this.selected_search_result_index = null;
        }

    }

};

/**
 * Opens the selected search result.
 */
Search.prototype.open_search_result = function() {

    if (this.search_results.length) {

        var open_search_result;

        if (this.search_results.length == 1) {
            open_search_result = this.search_results[0];
        } else if (this.selected_search_result_index != null) {
            open_search_result = this.search_results[
                this.selected_search_result_index
            ];
        }

        if (open_search_result) {
            window.location = open_search_result.url;
        }

    }

};

$(function() {
    new Search();
});
