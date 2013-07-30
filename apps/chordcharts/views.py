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

    boxed_chart = chart.boxed_chart()
    chord_types = ChordType.objects.all()

    context = {
        'settings': BOXED_CHART,
        'song_name': chart.song.name,
        'song_slug': chart.song.slug,
        'chart_key': chart.key,
        'boxed_chart': boxed_chart,
        'boxed_chart_json': json.dumps(boxed_chart.client_data()),
        'sections': chart.section_set.all(),
        'all_keys': all_keys,
        'edit': edit,
        'chord_types': chord_types,
        'chord_types_json': [chord_type.client_data()
            for chord_type in chord_types]
    }

    return render(request, 'chart.html', context)
