module.exports = Backbone.View.extend({

    show: function() {
        if (confirm(
            'A problem occured while synchronizing your changes to ' +
            'the server. Please refresh the page and try again.'
        )) {
            location.reload();
        }
    }

});
