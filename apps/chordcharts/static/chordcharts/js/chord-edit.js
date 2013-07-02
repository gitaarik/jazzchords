var ChartChordChange = function() {

    var self = this
    self.box_selector = '.box'
    self.chord_edit_selector = '.chord-edit'
    self.boxes = $('.chord-boxes ' + self.box_selector)
    self.chord_containers = self.boxes.find('.chord-container')
    self.chord_name_selector = '.chord-name'

    self.chord_containers.on('click', function() {
        self.open_chord_edit_widget(this)
    })

    $(document).on('click', function(event) {
        self.close_chord_edit_widget()
    })

}

ChartChordChange.prototype.open_chord_edit_widget = function(chord_container) {
    /*
     * Open the chord edit widget for the chord based on the provided
     * chord-container.
     */

    this.chord_edit = $(chord_container).closest(
        this.box_selector).find(this.chord_edit_selector)

    chord_name_offset = this.chord_name_offset(chord_container)

    this.chord_edit.css({
        'top': chord_name_offset.top - 11,
        'left': chord_name_offset.left - 11
    })

    this.chord_edit.show()

}

ChartChordChange.prototype.chord_name_offset = function(chord_container) {
    /*
     * Get the offset of the chord-name relative to the chord-container.
     */

    var chord_name_offset = {}

    chord_name_offset.top = 
        $(chord_container).find(this.chord_name_selector).offset().top -
        $(chord_container).offset().top

    chord_name_offset.left =
        $(chord_container).find(this.chord_name_selector).offset().left -
        $(chord_container).offset().left

    return chord_name_offset

}


ChartChordChange.prototype.chord_name_offset = function(chord_container) {
    /*
     * Close the chord edit widget if the click was outside the widget or on
     * the title (chord-name) of the widget.
     */

    // still need to fix this
    return

}


$(function() {
    new ChartChordChange()
})
