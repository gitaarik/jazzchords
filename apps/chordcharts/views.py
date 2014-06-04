import json
from django.shortcuts import render, redirect
from django.http import HttpResponse

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

    def get_set_default_key():
        """
        Sets `set_default_key` according to the value of the GET
        parameter `set-default-key` if it is given.

        `set_default_key` indicates if the key that is given in
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

    def set_chart_key(key):
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

    set_default_key = get_set_default_key()

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
        'edit': edit,
        'set_default_key': set_default_key
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


def chart_delete(request, song_slug, chart_id):

    if request.method == 'POST':

        #Chart.objects.get(id=chart_id, song__slug=song_slug).delete()

        response = render(request, 'chordcharts/chart_deleted.html')

    else:
        response = HttpResponse(status=405)

    return response
