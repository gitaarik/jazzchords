import json
from django.shortcuts import render, redirect

from songs.models import Song
from .models import Chart, Key, ChordType
from .settings import BOXED_CHART
from .helpers.new_chart import process_new_chart_post, FormErrors


def chart(request, song_slug, chart_id, key_slug=None, edit=False):
    """
    Renders the view for the chart.

    Could be the normal chart or view edit version. In case of the edit
    version, `edit` should be `True`.
    """

    def set_chart_key(key):
        """
        Overrides the default key of the chart in case it was given.
        """
        if key_slug:
            try:
                chart.key = Key.objects.get(slug=key_slug)
            except:
                pass

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

    chart = Chart.objects.get(id=chart_id, song__slug=song_slug)
    set_chart_key(chart)
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
        'edit': edit
    }

    return render(request, 'chordcharts/chart/base.html', context)


def new_chart(request):

    response = None
    errors = []

    if request.method == 'POST':

        try:
            chart = process_new_chart_post(request)
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
