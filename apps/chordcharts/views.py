import json
from django.shortcuts import render, redirect
from django.http import (
    HttpResponse, HttpResponseBadRequest, HttpResponsePermanentRedirect
)
from django.core.urlresolvers import reverse
from django.core.exceptions import ObjectDoesNotExist

from songs.models import Song
from .models import Chart, Key, ChordType
from .settings import BOXED_CHART
from .helpers.new_chart import ProcessNewChartPost, FormErrors


def song_index(request):

    context = {
        'songs': Song.objects.all()
    }

    return render(request, 'chordcharts/song_index.html', context)


def chart(request, song_slug, chart_id, key_slug=None, edit=False):
    """
    Renders the view for the chart.

    Could be the normal chart or view edit version. In case of the edit
    version, `edit` should be `True`.
    """

    def get_set_default_key():
        """
        Returns a boolean indicating if the key that is given in
        `key_slug` should be set as the default key for this chart (in
        case this happens in edit mode).
        """

        set_default_key = request.GET.get('set-default-key')

        if set_default_key:
            if set_default_key == '0':
                set_default_key = False

        if set_default_key is None:
            set_default_key = True

        return set_default_key

    def set_chart_key(chart, key_slug, set_default_key):
        """
        Overrides the default key of the chart in case it was given.
        """
        if key_slug:

            try:
                chart.key = Key.objects.get(slug=key_slug)
            except:
                pass
            else:

                if edit and set_default_key:
                    chart.save()

    def chord_types_sets(chord_types):
        """
        Returns two sets of chord types lists.
        """
        return (chord_types[:12], chord_types[12:])

    def chord_types_json(chord_types):
        """
        Returns the JSON representation of the given `chord_types`.
        """
        chord_types_data = [
            chord_type.client_data()
            for chord_type in chord_types
        ]
        return json.dumps(chord_types_data)

    def keys_json(keys):
        """
        Returns the JSON representation of the given `keys`.
        """
        all_keys_data = [
            key.client_data()
            for key in all_keys
        ]
        return json.dumps(all_keys_data)

    def get_redirect_wrong_slug(chart, song_slug, key_slug):
        """
        Returns a redirect response in case the given `song_slug` isn't
        equal to the chart's song's slug. Otherwise returns `None`.
        """

        if song_slug != chart.song.slug:

            if edit:
                view = 'chordcharts:chart_edit'
            else:
                view = 'chordcharts:chart'

            kwargs = {
                'chart_id': chart.id,
                'song_slug': chart.song.slug,
            }

            if key_slug:
                kwargs['key_slug'] = key_slug

            return HttpResponsePermanentRedirect(
                reverse(view, kwargs=kwargs)
            )

    chart = Chart.objects.get(id=chart_id)
    redirect_response = get_redirect_wrong_slug(chart, song_slug, key_slug)

    if redirect_response:
        return redirect_response
    else:

        set_default_key = get_set_default_key()
        set_chart_key(chart, key_slug, set_default_key)
        chart.cleanup()

        all_keys = Key.objects.all()
        chart_keys = all_keys.filter(tonality=chart.key.tonality)
        chord_types = ChordType.objects.all()
        chart_data = chart.client_data()

        context = {
            'settings': BOXED_CHART,
            'settings_json': json.dumps(BOXED_CHART),
            'chart': chart_data,
            'chart_json': json.dumps(chart_data),
            'chart_keys': chart_keys,
            'all_keys_json': keys_json(all_keys),
            'chord_types_sets': chord_types_sets(chord_types),
            'chord_types_json': chord_types_json(chord_types),
            'edit': edit,
            'set_default_key': set_default_key
        }

        return render(request, 'chordcharts/chart/base.html', context)


def new_chart(request):
    """
    Returns a view where you can create new charts.
    """

    response = None
    errors = []

    if request.method == 'POST':

        try:
            chart = ProcessNewChartPost(request).process()
        except FormErrors as formErrors:
            errors = formErrors.errors
        else:
            response = redirect(
                'chordcharts:chart_edit',
                song_slug=chart.song.slug,
                chart_id=chart.id
            )

    if not response:

        keys = {}

        for key in Key.objects.all():

            if key.tonality not in keys:
                keys[key.tonality] = []

            keys[key.tonality].append(key)

        context = {
            'key_select_tones': Key.TONES_CHOICES,
            'keys_major': keys[Key.TONALITY_MAJOR],
            'keys_minor': keys[Key.TONALITY_MINOR],
            'song_name_max_length': Song._meta.get_field('name').max_length,
            'short_description_max_length': (
                Chart._meta.get_field('short_description').max_length
            ),
            'video_url_max_length': (
                Chart._meta.get_field('video_url').max_length
            ),
            'lyrics_url_max_length': (
                Chart._meta.get_field('lyrics_url').max_length
            ),
            'errors': errors
        }

        response = render(request, 'chordcharts/new_chart.html', context)

    return response


def chart_delete(request, song_slug, chart_id):
    """
    On a POST, will delete the chart with id `chart_id`.
    """

    if request.method == 'POST':

        try:
            chart = Chart.objects.get(id=chart_id)
        except ObjectDoesNotExist:
            response = HttpResponseBadRequest('Song not found')
        else:

            song = chart.song
            chart.delete()

            if song.charts.count() == 0:
                song.delete()

            context = {
                'song_name': request.POST.get('song_name')
            }

            response = render(
                request,
                'chordcharts/chart_deleted.html',
                context
            )

    else:
        response = HttpResponse(status=405)

    return response


def how_to_read(request):
    return render(request, 'chordcharts/how_to_read.html')


def chord_symbols(request):

    context = {
        'chord_types': ChordType.objects.all()
    }

    return render(request, 'chordcharts/chord_symbols.html', context)
