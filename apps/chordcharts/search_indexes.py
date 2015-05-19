from haystack import indexes
from .models import Chart


class ChartIndex(indexes.SearchIndex, indexes.Indexable):

    text = indexes.CharField(document=True, use_template=True)
    content_auto = indexes.EdgeNgramField(model_attr='song__name')
    public = indexes.BooleanField(model_attr='public')
    owner_id = indexes.IntegerField(model_attr='owner__id')

    def get_model(self):
        return Chart
