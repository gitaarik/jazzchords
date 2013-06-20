from django.shortcuts import render

from .models import Chart
from .settings import BOXED_CHART


def chart(request, song_slug):

    chart = Chart.objects.get(song__slug=song_slug)

    context = {
        'settings': BOXED_CHART,
        'song_name': chart.song.name,
        'chart_key': chart.key,
        'boxed_chart': chart.boxed_chart(),
        'sections': chart.section_set.all(),
    }

    return render(request, 'chart.html', context)


