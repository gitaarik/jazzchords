from django.http import HttpResponse, HttpResponseBadRequest
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import views, viewsets

from songs.models import Song
from .serializers import (
    ChartSerializer, SectionSerializer, LineSerializer,
    MeasureSerializer, ChordSerializer
)
from .models import Chart, Section, Line, Measure, Chord


class ChartViewSet(viewsets.ModelViewSet):
    model = Chart
    serializer_class = ChartSerializer
    queryset = Chart.objects.all()


class SectionViewSet(viewsets.ModelViewSet):

    model = Section
    serializer_class = SectionSerializer

    def get_queryset(self, *args, **kwargs):
        return Section.objects.filter(chart__id=self.kwargs['chart_pk'])

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['chart_id'] = self.kwargs['chart_pk']
        return context


class LineViewSet(viewsets.ModelViewSet):

    model = Line
    serializer_class = LineSerializer

    def get_queryset(self, *args, **kwargs):
        return Line.objects.filter(
            section__id=self.kwargs['section_pk'],
            section__chart__id=self.kwargs['chart_pk']
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
            line__section__chart__id=self.kwargs['chart_pk']
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
            measure__line__section__chart__id=self.kwargs['chart_pk']
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['measure_id'] = self.kwargs['measure_pk']
        return context


class ChartSongNameView(views.APIView):
    """
    Change the songname for the chart.

    If the new name matches an existing song, that song will be related
    to the chart. Otherwise a new song with this name will be created.
    If the old song doesn't have any relations to it anymore, it will be
    deleted.
    """

    def put(self, request, chart_id):

        self.request = request

        try:
            chart = Chart.objects.get(id=chart_id)
        except ObjectDoesNotExist:
            return HttpResponseBadRequest('Chart not found')

        old_song = chart.song
        new_song = self.get_new_song()
        chart.song = new_song
        chart.save()

        if old_song.charts.count() == 0:
            old_song.delete()

        return HttpResponse('Successfully changed song name')

    def get_new_song(self):

        song_name = self.request.DATA.get('song_name')

        if not song_name:
            return HttpResponseBadRequest('No songname given')

        try:
            new_song = Song.objects.get(name=song_name)
        except ObjectDoesNotExist:
            new_song = Song(name=song_name)
            new_song.save()

        return new_song
