from django.contrib import admin
from chordcharts.models import Chart
from .models import Song


class ChartInline(admin.StackedInline):
    model = Chart
    extra = 0

class SongAdmin(admin.ModelAdmin):
    inlines = (ChartInline,)


admin.site.register(Song, SongAdmin)
