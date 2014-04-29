from rest_framework import viewsets
from .serializers import SectionSerializer, LineSerializer
from .models import Section, Line


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


class LineViewSet(viewsets.ModelViewSet):

    model = Line
    serializer_class = LineSerializer

    def get_queryset(self, *args, **kwargs):
        return Line.objects.filter(
            section_id=self.kwargs['section_pk'],
            section__chart__id=self.kwargs['chart_id'],
            section__chart__song__slug=self.kwargs['song_slug']
        )

    def get_serializer_context(self):
        context = super(LineViewSet, self).get_serializer_context()
        context['section_id'] = self.kwargs['section_pk']
        return context
