from django.db.models import Q
from haystack.query import SearchQuerySet
from ..models import Chart


def search_charts(search_term, user=None):

    if not user or user.is_anonymous():
        filters = Q(public=True)
    else:
        filters = Q(public=True) | Q(owner_id=user.id)

    return SearchQuerySet().models(Chart).filter(
        filters,
        content_auto=search_term
    )
