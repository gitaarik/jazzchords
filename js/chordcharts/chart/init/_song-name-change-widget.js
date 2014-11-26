var SongNameChangeWidget = require('../models/_song-name-change-widget.js');
var SongNameChangeWidgetView = require('../views/_song-name-change-widget.js');


var songNameChangeWidget = new SongNameChangeWidget();

new SongNameChangeWidgetView({
    el: GLOBALS.base_el_selector + ' .chord-chart-header .song-name',
    model: songNameChangeWidget
});

$('html').on('click', function(event) {

    if (songNameChangeWidget.get('visible')) {

        var target = $(event.target);

        if (
            !target.closest(
                GLOBALS.base_el_selector + ' .song-name .song-name-change'
            ).length &&
            !target.closest(
                GLOBALS.base_el_selector + ' .song-name h1 span'
            ).length
        ) {
            songNameChangeWidget.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (
        songNameChangeWidget.get('visible') &&
        $.inArray(event.key, ['Esc', 'Escape']) > -1
    ) {
        songNameChangeWidget.set('visible', false);
    }

});

return songNameChangeWidget;
