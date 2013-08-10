class CacheControl(object):

    def process_response(self, request, response):
        """
        Prevents certain paths from being cached by the browser.
        """

        if request.path.startswith('/static/js/apps/'):
            response['Cache-Control'] = 'must-revalidate, no-cache'

        return response
