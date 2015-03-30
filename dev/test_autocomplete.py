from haystack.query import SearchQuerySet
from songs.models import Song

search_results = SearchQuerySet().models(Song).autocomplete(
    content_auto='when'
)
results_dict = []

for search_result in search_results:
    results_dict.append({
        'name': search_result.object.name
    })

print(results_dict)
