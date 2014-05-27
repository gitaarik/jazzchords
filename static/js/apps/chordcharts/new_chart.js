var NewChart = function() {
    this.initKeyTone();
};

NewChart.prototype.initKeyTone = function() {

    var key = $('.chart-settings .key');
    var tone = key.find('.tone');
    var tone_currently_selected = tone.find('.currently-selected');
    var tone_choices = tone.find('.tone-choices');

    tone_currently_selected.click(function() {
        tone_choices.toggle();
    });

    tone.find('.tone-choices ul li').click(function(el) {
        var tone_chosen = $(el.target).data('tone');
        tone.find('.tone-input').attr('value', tone_chosen);
        tone_currently_selected.html(tone_chosen);
        tone_choices.hide();
    });

};

$(function() {

    var newChart = new NewChart();
    
});
