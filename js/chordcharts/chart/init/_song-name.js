var SongName = require('../models/_song-name.js');
var SongNameView = require('../views/_song-name.js');


var songName = new SongName();

new SongNameView({
    el: GLOBALS.base_el_selector + ' .chord-chart-header .song-name',
    model: songName
});

return songName;
