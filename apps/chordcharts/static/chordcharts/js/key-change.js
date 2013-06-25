var ChartKeyChange = function() {

    var self = this
    self.key_select = $('.chord-chart .key-select')
    self.closed = self.key_select.find('.closed')
    self.open = self.key_select.find('.open')
    self.open_current_key = self.open.find('.current-key')

    self.closed.on('click', function() {
        self.open.show()
    })

    $(document).on('click', function(event) {

        if(
            (!$(event.target).closest(self.closed).length &&
             !$(event.target).closest(self.open).length) ||
            $(event.target).closest(self.open_current_key).length
        ) {
            self.open.hide()
        }

    })

}

$(function() {
    new ChartKeyChange()
})
