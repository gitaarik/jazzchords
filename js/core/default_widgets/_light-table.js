(function() {

    var LightTables = function() { };

    /**
     * Reinitiates any light-tables on the page.
     *
     * Makes sure rows with the class `merge-to-next` and the the last
     * row have no border at the bottom.
     *
     * Will automatically be called on page load. Can be called later if
     * you've changed the layout of the table.
     */
    LightTables.prototype.reinit = function() {

        $('.light-table').each(function() {

            $('tr').each(function() {
                $(this).find('th, td').css('border-bottom-width', '1');
            });

            $('tr.merge-to-next').each(function() {
                $(this).find('th, td').css('border-bottom-width', '0');
            });

            $('tbody:visible:last tr:visible:last').each(function() {
                $(this).find('th, td').css('border-bottom-width', '0');
            });

        });

    };

    window._LightTables = new LightTables();

    $(function() {
        window._LightTables.reinit();
    });

})();
