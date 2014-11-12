from haystack import indexes
from .models import Chart


class ChartIndex(indexes.SearchIndex, indexes.Indexable):

    text = indexes.CharField(document=True, use_template=True)
    content_auto = indexes.EdgeNgramField(model_attr='song__name')

    def get_model(self):
        return Chart
