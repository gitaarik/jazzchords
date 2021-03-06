var AutoComplete = require('./widgets/_auto-complete');


var autoCompleteDelegate = {

    get_results: function(input_val, callback_func) {

        $.post(
            '/api/chordcharts/search/',
            {'search_term': input_val},
            function(response) {
                callback_func(input_val, response.results);
            }
        );

    },

    format_result: function(result) {

        var short_description_el = '';

        if (result.short_description) {
            short_description_el = (
                '<span class="short-description">' +
                    ' - ' + result.short_description +
                '</span>'
            );
        }

        return (
            '<a href="' + result.url + '">' +
                '<span class="song-name">' + result.song_name + '</span>' +
                short_description_el +
            '</a>'
        );

    },

    format_autocomplete: function(result) {
        return result.song_name;
    },

    choose_result: function(result) {
        window.location = result.url;
    },

    no_selected_result_submit: function(input_val) {

        if (input_val) {
            window.location = '/search/' + input_val + '/';
        }

    }

};

$(function() {

    new AutoComplete(
        '._base-header .search',
        autoCompleteDelegate,
        {
            min_input_characters: 2,
            show_no_results: true,
            result_option_required: true,
            auto_select_when_1_result: true
        }
    );

});
