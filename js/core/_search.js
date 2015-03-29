var AutoComplete = require('./widgets/_auto-complete');


function get_results(input_val, callback_func) {

    $.post(
        '/api/chordcharts/search/',
        {'search_term': input_val},
        function(response) {
            callback_func(response.results);
        }
    );

}

function format_result(result) {

    var short_description_el = '';

    if (result.short_description) {
        short_description_el = (
            '<span class="short-description">' +
                ' - ' + result.short_description +
            '</span>'
        );
    }

    return (
        '<li><a href="' + result.url + '">' +
            '<span class="song-name">' + result.song_name + '</span>' +
            short_description_el +
        '</a></li>'
    );

}

function choose_result(result) {
    window.location = result.url;
}

$(function() {

    new AutoComplete({
        selector: '._base-header .search',
        get_results_callback: get_results,
        format_result_callback: format_result,
        choose_result_callback: choose_result
    });

});
