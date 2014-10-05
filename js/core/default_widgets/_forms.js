$(function() {

    // Adds the CSS class `_text-input-invalid` to required input
    // elements of forms that were attempted to be submitted.
    $('form').each(function() {
        var form = this;
        $(this).find('input[type=submit]').click(function() {
            $(form).addClass('_submit-attempted');
        });
    });

});
