module.exports = Backbone.Model.extend({

    sync: function() {

        return Backbone.sync.apply(this, arguments).fail(function() {

            if (confirm(
                'A problem occured while synchronizing your changes to ' +
                'the server. Please refresh the page and try again.'
            )) {
                location.reload();
            }

        });

    }

});
