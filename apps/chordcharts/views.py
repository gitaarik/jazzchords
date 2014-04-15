import json
from django.shortcuts import render

from .models import Chart, Key, ChordType
from .settings import BOXED_CHART


def chart(request, song_slug, key_slug=None, edit=False):

    chart = Chart.objects.get(song__slug=song_slug)

    if key_slug:
        try:
            chart.key = Key.objects.get(slug=key_slug)
        except:
            pass

    all_keys = Key.objects.filter(tonality=chart.key.tonality)
    chord_types = ChordType.objects.all()

    chord_types_data = [
        chord_type.client_data()
        for chord_type in chord_types
    ]

    chart_data = chart.client_data()

    context = {
        'settings': BOXED_CHART,
        'chart': chart_data,
        'chart_json': json.dumps(chart_data),
        'all_keys': all_keys,
        'edit': edit,
        'chord_types_sets': (chord_types[:12], chord_types[12:]),
        'chord_types_json': json.dumps(chord_types_data)
    }

    return render(request, 'chart.html', context)
