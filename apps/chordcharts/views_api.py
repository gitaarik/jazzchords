from rest_framework import viewsets
from .serializers import (
    SectionSerializer, LineSerializer,
    MeasureSerializer, ChordSerializer
)
from .models import Section, Line, Measure, Chord


class SectionViewSet(viewsets.ModelViewSet):

    model = Section
    serializer_class = SectionSerializer

    def get_queryset(self, *args, **kwargs):
        return Section.objects.filter(
            chart__id=self.kwargs['chart_id'],
            chart__song__slug=self.kwargs['song_slug']
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['chart_id'] = self.kwargs['chart_id']
        return context


class LineViewSet(viewsets.ModelViewSet):

    model = Line
    serializer_class = LineSerializer

    def get_queryset(self, *args, **kwargs):
        return Line.objects.filter(
            section__id=self.kwargs['section_pk'],
            section__chart__id=self.kwargs['chart_id'],
            section__chart__song__slug=self.kwargs['song_slug']
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['section_id'] = self.kwargs['section_pk']
        return context


class MeasureViewSet(viewsets.ModelViewSet):

    model = Measure
    serializer_class = MeasureSerializer

    def get_queryset(self, *args, **kwargs):
        return Measure.objects.filter(
            line__id=self.kwargs['line_pk'],
            line__section__id=self.kwargs['section_pk'],
            line__section__chart__id=self.kwargs['chart_id'],
            line__section__chart__song__slug=self.kwargs['song_slug']
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['line_id'] = self.kwargs['line_pk']
        return context


class ChordViewSet(viewsets.ModelViewSet):

    model = Chord
    serializer_class = ChordSerializer

    def get_queryset(self, *args, **kwargs):
        return Chord.objects.filter(
            measure__id=self.kwargs['measure_pk'],
            measure__line__id=self.kwargs['line_pk'],
            measure__line__section__id=self.kwargs['section_pk'],
            measure__line__section__chart__id=self.kwargs['chart_id'],
            measure__line__section__chart__song__slug=self.kwargs['song_slug']
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['measure_id'] = self.kwargs['measure_pk']
        return context
