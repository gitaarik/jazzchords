from rest_framework import viewsets
from .serializers import SectionSerializer
from .models import Section


class SectionViewSet(viewsets.ModelViewSet):

    model = Section
    serializer_class = SectionSerializer

    def get_queryset(self, *args, **kwargs):
        return Section.objects.filter(
            chart__id=self.kwargs['chart_id'],
            chart__song__slug=self.kwargs['song_slug']
        )

    def get_serializer_context(self):
        context = super(SectionViewSet, self).get_serializer_context()
        context['chart_id'] = self.kwargs['chart_id']
        return context
