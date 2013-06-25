from django.shortcuts import render

from .models import (Chart, Key)
from .settings import BOXED_CHART


def chart(request, song_slug, key_tone=None):

    chart = Chart.objects.get(song__slug=song_slug)

    if key_tone:
        chart.key = Key.objects.get(tone=key_tone)

    other_keys = (Key.objects
        .filter(tonality=chart.key.tonality)
        .exclude(pk=chart.key.pk))

    context = {
        'settings': BOXED_CHART,
        'song_name': chart.song.name,
        'song_slug': chart.song.slug,
        'chart_key': chart.key,
        'boxed_chart': chart.boxed_chart(),
        'sections': chart.section_set.all(),
        'other_keys': other_keys
    }

    return render(request, 'chart.html', context)


