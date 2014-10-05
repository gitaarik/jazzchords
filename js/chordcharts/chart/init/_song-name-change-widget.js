var SongNameChangeWidget = require('../models/_song-name-change-widget.js');
var SongNameChangeWidgetView = require('../views/_song-name-change-widget.js');


var songNameChangeWidget = new SongNameChangeWidget();

new SongNameChangeWidgetView({
    el: $('.chord-chart .chord-chart-header .song-name'),
    model: songNameChangeWidget
});

$('html').on('click', function(event) {

    if (songNameChangeWidget.get('visible')) {

        var target = $(event.target);

        if (
            !target
                .closest('.song-name-change')
                .closest('.song-name')
                .closest('.chord-chart')
                .length &&
            !target
                .closest('span')
                .closest('h1')
                .closest('.song-name')
                .closest('.chord-chart')
                .length
        ) {
            songNameChangeWidget.set('visible', false);
        }

    }

});

$('html').on('keyup', function(event) {

    if (songNameChangeWidget.get('visible') && event.key == 'Esc') {
        songNameChangeWidget.set('visible', false);
    }

});

return songNameChangeWidget;
