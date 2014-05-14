define(
    [],
    function() {

        return Backbone.View.extend({

            tagName: 'div',
            className: 'subsection-sidebar-part-edit',

            events: {
                'click .letter': 'chooseLetter'
            },

            chooseLetter: function() {

            },

        });

    }
);
