require('../core/widgets/_form-table-tooltips.js');
var AutoComplete = require('../core/widgets/_auto-complete');
var KeySelectWidget = require('../core/widgets/_key-select.js');


function initSongNameAutoComplete() {

    var autoCompleteSelector = (
        '.new-chart .chart-settings .song-name .auto-complete'
    );

    var songNameAutoCompleteDelegate = {

        get_results: function(input_val, callback_func) {

            $.post(
                '/api/songs/search/',
                {'search_term': input_val},
                function(response) {
                    callback_func(input_val, response.results);
                }
            );

        },

        format_result: function(result) {
            return result.name;
        },

        format_autocomplete: function(result) {
            return result.name;
        }

    };

    new AutoComplete(
        autoCompleteSelector,
        songNameAutoCompleteDelegate,
        { min_input_characters: 2 }
    );

}

function initKeySelectWidget() {

    var keySelectWidgetDelegate = {

        key_changed: function(key) {
            $('.key-tonic-input').prop('value', key.get('tonic'));
            $('.key-tonality-input').prop('value', key.get('tonality'));
        }

    };

    new KeySelectWidget('.key-select-widget', keySelectWidgetDelegate);

}

$(function() {
    $('#chart_song').focusAtEnd();
    initSongNameAutoComplete();
    initKeySelectWidget();
});
