from django.core.exceptions import ObjectDoesNotExist
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import views, viewsets
from rest_framework.exceptions import ParseError, PermissionDenied
from rest_framework.response import Response
from haystack.query import SearchQuerySet

from songs.models import Song
from users.permissions import UserPermissions
from .serializers import (
    ChartSerializer, SectionSerializer, LineSerializer,
    MeasureSerializer, ChordSerializer
)
from .models import Key, Chart, Section, Line, Measure, Chord


class ChartViewSet(viewsets.ModelViewSet):
    permission_classes = (UserPermissions,)
    serializer_class = ChartSerializer
    queryset = Chart.objects.all()


class SectionViewSet(viewsets.ModelViewSet):

    permission_classes = (UserPermissions,)
    serializer_class = SectionSerializer

    def get_queryset(self, *args, **kwargs):
        return Section.objects.filter(chart__id=self.kwargs['chart_pk'])

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['chart_id'] = self.kwargs['chart_pk']
        return context


class LineViewSet(viewsets.ModelViewSet):

    permission_classes = (UserPermissions,)
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

    permission_classes = (UserPermissions,)
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

    permission_classes = (UserPermissions,)
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
    Change the songname of a chart.

    If the new name matches an existing song, that song will be related
    to the chart. Otherwise a new song with this name will be created.
    If the old song doesn't have any relations to it anymore, it will be
    deleted.
    """

    @transaction.atomic
    def post(self, request, chart_id):

        chart = get_object_or_404(Chart, id=chart_id)
        require_permission(request, chart, 'change')

        old_song = chart.song
        new_song = self.get_new_song(request)
        chart.song = new_song
        print('{} saving new song: {}'.format('-' * 25, new_song.name))
        chart.save()

        if old_song.charts.count() == 0:
            print('{} deleting old song: {}'.format('-' * 25, old_song.name))
            old_song.delete()

        return Response({})

    def get_new_song(self, request):

        song_name = request.data.get('song_name')

        if not song_name:
            raise ParseError('No songname given')

        try:
            new_song = Song.objects.get(name=song_name)
        except ObjectDoesNotExist:
            new_song = Song(name=song_name)
            new_song.save()

        return new_song


class ChartTransposeView(views.APIView):
    """
    Transpose a chart.

    Will update the tonic of the keys of all sections with the interval
    between the tonic of the key of the first section and the tonic in
    the payload.
    """

    def post(self, request, chart_id):

        chart = get_object_or_404(Chart, id=chart_id)
        require_permission(request, chart, 'change')

        try:
            key = Key.objects.get(
                tonic=request.data.get('tonic'),
                tonality=1
            )
        except ObjectDoesNotExist:
            raise ParseError('Invalid key')

        chart.transpose(key.tonic)

        return Response({})


class SectionKeyView(views.APIView):
    """
    View to update the section key without transposing the chords.
    """

    def post(self, request, section_id):

        section = get_object_or_404(Section, id=section_id)
        require_permission(request, section, 'change')

        tonality_word = request.data.get('tonality')

        if type(tonality_word) == int:
            tonality = tonality_word
        elif tonality_word.lower() == 'major':
            tonality = Key.TONALITY_MAJOR
        elif tonality_word.lower() == 'minor':
            tonality = Key.TONALITY_MINOR
        else:
            raise ParseError('Invalid tonality. Choose "major" or "minor".')

        try:
            key = Key.objects.get(
                tonic=request.data.get('tonic'),
                tonality=tonality
            )
        except ObjectDoesNotExist:
            raise ParseError('Invalid key')

        section.update_key(key)

        return Response({})


class SearchCharts(views.APIView):
    """
    View to search for charts.
    """

    def post(self, request):

        if request.user.is_anonymous():
            filters = Q(public=True)
        else:
            filters = Q(public=True) | Q(owner_id=request.user.id)

        search_term = request.POST.get('search_term')
        search_results = SearchQuerySet().models(Chart).filter(
            filters,
            content_auto=search_term
        )
        results_dict = []

        for search_result in search_results:

            chart = search_result.object
            song = chart.song
            url = reverse(
                'chordcharts:chart',
                kwargs={
                    'chart_id': chart.id,
                    'song_slug': song.slug
                }
            )

            results_dict.append({
                'url': url,
                'song_name': song.name,
                'short_description': chart.short_description
            })

        return Response({'results': results_dict})

def require_permission(request, obj, permission):
    if not request.user.has_perm(permission, obj):
        raise PermissionDenied()
