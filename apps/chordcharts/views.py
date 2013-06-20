from django.shortcuts import render

from .models import Chart
from .settings import BOXED_CHART


def chart(request, song_slug):

    chart = Chart.objects.get(song__slug=song_slug)

    settings = BOXED_CHART

    settings['section_width'] = (
        settings['section_sidebar_width'] +
        (8 * (settings['box_width'] + settings['border_width'])) +
        settings['border_width']
    )

    settings['sections'] = [
        {
            'height':
                (4 * (settings['box_height'] + settings['border_width'])) +
                settings['border_width']
        },
        {
            'height':
                (2 * (settings['box_height'] + settings['border_width'])) +
                settings['border_width']
        }
    ]

    context = {
        'settings': BOXED_CHART,
        'song_name': chart.song.name,
        'chart_key': chart.key,
        'boxed_chart': chart.boxed_chart(),
        'sections': chart.section_set.all(),
    }

    return render(request, 'chart.html', context)


