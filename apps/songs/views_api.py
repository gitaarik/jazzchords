from rest_framework import views
from rest_framework.response import Response
from haystack.query import SearchQuerySet
from .models import Song


class SearchSongs(views.APIView):
    """
    View to search for charts.
    """

    def post(self, request):

        search_term = request.POST.get('search_term')
        search_results = SearchQuerySet().models(Song).autocomplete(
            content_auto=search_term
        )
        results_dict = []

        for search_result in search_results:
            results_dict.append({
                'name': search_result.object.name
            })

        return Response({'results': results_dict})
