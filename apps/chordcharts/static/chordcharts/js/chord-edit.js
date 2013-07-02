var ChartChordEdit = function() {

    var self = this
    self.box_selector = '.box'
    self.chord_edit_selector = '.chord-edit'
    self.chord_container_selector = '.chord-container'
    self.boxes = $('.chord-boxes ' + self.box_selector)
    self.chord_containers = self.boxes.find(self.chord_container_selector)
    self.chord_name_selector = '.chord-name'
    self.chord_edit = false
    self.opened_widget = false

    $(document).on('click', function(event) {
        self.close_widget_maybe($(event.target))
    })

    self.chord_containers.on('click', function() {
        self.open_widget(this)
    })

}

ChartChordEdit.prototype.open_widget = function(chord_container) {
    /*
     * Open the chord edit widget for the chord based on the provided
     * chord-container.
     */

    this.close_widget() // close any open widget before opening new one
    this.chord_edit = $(chord_container).closest(
        this.box_selector).find(this.chord_edit_selector)

    chord_name_offset = this.chord_name_offset(chord_container)

    this.chord_edit.css({
        'top': chord_name_offset.top - 11,
        'left': chord_name_offset.left - 11
    })

    this.chord_edit.show()
    this.opened_widget = true

}

ChartChordEdit.prototype.chord_name_offset = function(chord_container) {
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

ChartChordEdit.prototype.close_widget_maybe = function(clicked_element) {
    /*
     * Close the chord edit widget if the click was outside the widget or on
     * the title (chord-name) of the widget.
     */

    /*
    Close the edit widget if:
    - an edit widget is open (this.chord_edit)
    - the widget hasn't been opened for the first time (this.opened_widget)
    - the widgets content's is not clicked, or the widget's title is clicked
    */

    if(this.chord_edit && !this.opened_widget && (
       !clicked_element.closest(this.chord_edit_selector).length ||
       clicked_element.closest(this.chord_name_selector).closest(
           this.chord_edit_selector).length
    )) {
        this.close_widget()
    }

    this.opened_widget = false

}

ChartChordEdit.prototype.close_widget = function () {
    /*
     * Close the chord edit widget.
     */

    if(this.chord_edit) {
        this.chord_edit.hide()
    }

}

$(function() {
    new ChartChordEdit()
})
