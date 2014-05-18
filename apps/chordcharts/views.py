import json
from django.shortcuts import render

from .models import Chart, Key, ChordType
from .settings import BOXED_CHART


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

    return render(request, 'chart.html', context)
