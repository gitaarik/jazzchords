var Autocomplete = function(selector, delegate, options) {

    var that = this;
    this.delegate = delegate;
    this.options = options;

    this.base_el = $(selector);
    this.input_container_el = this.base_el.find('.input-container');
    this.input_el = this.input_container_el.find('.input');
    this.results_el = this.base_el.find('.results');

    this.input_val;
    this.last_input_value = '';
    this.results = {};
    this.tab_pressed = false;
    this.focussed = true;
    this.selected_result_index;
    this.results_cache = {};

    this.input_el.focus(function() {
        that.base_el.addClass('focussed');
    });

    $(window).click(function(event) {

        if ($(event.target).closest(selector).length == 0) {
            that.hide_results()
            that.base_el.removeClass('focussed');
            that.focussed = false;
        }

    });

    this.input_el.focus(function() {
        that.focussed = true;
    });

    this.input_el.keydown(function(event) {

        if ($.inArray(event.key, ['Esc', 'Escape']) > -1) {
            that.hide_results();
            that.selected_result_index = null;
            that.input_el.val(that.input_val);
            return false;
        } else if (event.key == 'Enter' && that.results_visible()) {
            event.preventDefault();
        }

    });

    this.input_el.keyup(function(event) {

        if ($.inArray(event.key, ['Down', 'ArrowDown']) > -1) {
            that.select_result_with_offset(1);
        } else if ($.inArray(event.key, ['Up', 'ArrowUp']) > -1) {
            that.select_result_with_offset(-1);
        } else if ($.inArray(event.key, ['Esc', 'Escape']) > -1) {
            that.input_el.val(that.input_val);
        } else if (event.key == 'Enter') {
            if (that.results_visible()) {
                event.preventDefault();
                that.choose_result();
            }
        } else {
            that.process_input_val();
        }

    });

    this.input_container_el.find('.before-input').focus(function() {

        if(that.results_visible()) {
            that.tab_pressed = true;
            that.select_result_with_offset(-1);
            that.input_el.focus();
            that.tab_pressed = false;
        } else {

            if (that.focussed) {
                var nextInput = $(
                    ':input:eq(' + ($(':input').index(this) - 1) + ')'
                );
                that.focussed = false;
            } else {
                var nextInput = that.input_el;
            }

            if (nextInput) nextInput.focus();

        }

    });

    this.input_container_el.find('.behind-input').focus(function() {

        if (that.results_visible()) {
            that.tab_pressed = true;
            that.select_result_with_offset(1);
            that.input_el.focus();
            that.tab_pressed = false;
        } else {

            if (that.focussed) {
                var nextInput = $(
                    ':input:eq(' + ($(':input').index(this) + 1) + ')'
                );
                that.focussed = false;
            } else {
                var nextInput = that.input_el;
            }

            if (nextInput) nextInput.focus();

        }

    });

    this.results_el.mousemove(function(event) {

        that.tab_pressed = false;
        var result_el = $(event.target).closest('li');

        if (result_el.length) {

            that.select_result(
                result_el.parent().find('li').index(result_el),
                false,
                true
            );

        }

    });

    this.base_el.mouseleave(function() {
        if (!that.input_el.is(':focus')) {
            that.hide_results();
        }
    });

    this.results_el.click(function() {
        that.select_result(that.selected_result_index);
        that.hide_results();
    });

};

/**
 * Processes the results for the current input value if it was changed
 * since last time.
 */
Autocomplete.prototype.process_input_val = function() {

    var new_input_value = this.input_el.val().trim();

    if (this.last_input_value != new_input_value) {
        this.input_val = new_input_value;
        this.fetch_results();
        this.last_input_value = new_input_value;
    }

};

/**
 * Gets the results for the current input value and processes them into
 * the results widget.
 */
Autocomplete.prototype.fetch_results = function() {

    var that = this;

    if (this.input_val) {

        if (this.input_val in this.results_cache) {
            this.process_results(this.results_cache[this.input_val]);
        } else {

            this.show_loading_indicator();

            this.delegate.get_results(this.input_val, function(results) {
                that.results_cache[that.input_val] = results;
                that.process_results(results);
            });

        }

    } else {
        this.results_el.html('');
        this.base_el.removeClass('results-on');
    }

};

Autocomplete.prototype.process_results = function(results) {

    this.results = results;
    var result_els = [];

    if (this.results.length) {

        var result;

        for (var i = 0; i < this.results.length; i++) {
            result_els.push(
                '<li>' +
                    this.delegate.format_result(
                        this.results[i]
                    ) +
                '</li>'
            );
        }

        this.results_el.html(result_els.join(''));
        this.show_results();
        this.selected_result_index = null;

        if (this.results.length == 1) {
            this.select_result(0, false);
        }

    } else {
        this.show_no_results_message();
    }

};

Autocomplete.prototype.show_loading_indicator = function() {

    if (this.options && this.options.show_no_results) {
        this.results_el.html('<li><span class="loading"></span></li>');
        this.base_el.addClass('results-on');
    }

};

/**
 * Shows a message in the results box saying there were no results found.
 */
Autocomplete.prototype.show_no_results_message = function() {

    if (this.options && this.options.show_no_results) {
        this.results_el.html('<li><span class="no-results">No charts found</span></li>');
        this.base_el.addClass('results-on');
    } else {
        this.hide_results();
    }

};

/**
 * Returns a boolean indicating wether the autocomplete suggestion popup is
 * visible or not.
 */
Autocomplete.prototype.results_visible = function() {
    return this.base_el.hasClass('results-on');
}

/**
 * Shows the results widget if there are any results.
 */
Autocomplete.prototype.show_results = function() {
    if (this.results.length) {
        this.base_el.addClass('results-on');
    }
};

/**
 * Hides the results widget.
 */
Autocomplete.prototype.hide_results = function() {

    var that = this;

    setTimeout(function() {
        if (!that.tab_pressed) {
            that.base_el.removeClass('results-on');
        } else {
            that.tab_pressed = false;
        }
    }, 0);

};

Autocomplete.prototype.select_result_with_offset = function(offset, autocomplete_input) {

    var index = this.selected_result_index;

    if (index == null) {

        if (offset > 0) {
            index = offset - 1;
        } else {
            index = this.results.length - 1;
        }

    } else {

        index += offset;

        if (index < 0) {
            index = null;
        }

        if (index >= this.results.length) {
            index = null;
        }

    }

    this.show_results();
    this.select_result(index);

}

/**
 * Selects the resuls with the given `offset` relative to the currently
 * selected result.
 */
Autocomplete.prototype.select_result = function(index, autocomplete_input, update_index) {

    if (update_index == null || update_index) {
        this.selected_result_index = index;
    }

    if (autocomplete_input == null) {
        autocomplete_input = true;
    }

    if (this.results.length) {

        var all_results_elements = this.results_el.find('li');
        all_results_elements.removeClass('selected');

        if (index == null) {
            this.input_el.val(this.input_val);
        } else {

            var selected_result_value = (
                this.delegate.format_autocomplete(this.results[index])
            );

            if (autocomplete_input) {
                this.input_el.val(selected_result_value);
            }

            this.last_input_value = selected_result_value;
            all_results_elements.eq(index).addClass('selected');

        }

    }

};

/**
 * Chooses the selected result.
 */
Autocomplete.prototype.choose_result = function() {

    var that = this;

    if (this.results.length) {

        var result;

        if (this.results.length == 1) {
            result = this.results[0];
        } else if (this.selected_result_index != null) {
            result = this.results[
                this.selected_result_index
            ];
        }

        if (result) {

            this.input_val = this.delegate.format_autocomplete(result);

            if (typeof this.delegate.choose_result != "undefined") {
                this.delegate.choose_result(result);
            }

            this.hide_results();

        } else {

            this.input_el.focus();

            if (this.options && this.options.result_option_required) {
                this.results_el.addClass('attention-animation');
                setTimeout(function() {
                    that.results_el.removeClass('attention-animation');
                }, 1000);
            } else {
                this.hide_results();
            }

        }

    }

};

module.exports = Autocomplete;
