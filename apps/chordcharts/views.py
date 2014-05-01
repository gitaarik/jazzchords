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

    def remove_empty_children(chart):
        """
        Removes any empty children of the given chart.

        Empty childs could appear when a request for a new object got
        through, but a request for a child for this object didn't.

        In case this happens, we remove it on this request, because we
        assume that when something like this happend (in case of a
        timeout or anything) this view would have been requested another
        time at some point. And it's easier (and probably more
        performant) than having a cronjob for this.
        """
        chart.remove_empty_children()

    def chord_types_sets(chord_types):
        """
        Returns two sets of chord types lists.
        """
        return (chord_types[:12], chord_types[12:])

    def chord_types_json(chord_types):
        """
        Returns the JSON representation of the chord types.
        """
        chord_types_data = [
            chord_type.client_data()
            for chord_type in chord_types
        ]
        return json.dumps(chord_types_data)

    chart = Chart.objects.get(id=chart_id, song__slug=song_slug)
    set_chart_key(chart)
    remove_empty_children(chart)

    all_keys = Key.objects.filter(tonality=chart.key.tonality)
    chord_types = ChordType.objects.all()
    chart_data = chart.client_data()

    context = {
        'settings': BOXED_CHART,
        'chart': chart_data,
        'chart_json': json.dumps(chart_data),
        'all_keys': all_keys,
        'edit': edit,
        'chord_types_sets': chord_types_sets(chord_types),
        'chord_types_json': chord_types_json(chord_types)
    }

    return render(request, 'chart.html', context)
