from django.core import urlresolvers
from django.contrib import admin

from .models import (
    Chart, Section, Line, Measure, Chord, ChordType, Note,
    Key, TimeSignature
)


class ChordInline(admin.StackedInline):
    model = Chord
    extra = 0


class MeasureAdmin(admin.ModelAdmin):
    inlines = (ChordInline,)


class MeasureInline(admin.StackedInline):

    model = Measure
    extra = 0
    readonly_fields = ('change',)

    def change(self, instance):

        if instance.id:
            change_url = urlresolvers.reverse(
                'admin:chordcharts_measure_change', args=(instance.id,)
            )

            return '<a class="changelink" href="{}">Change</a>'.format(
                change_url)

        else:
            return 'Save the measure first before editing the line.'

    change.allow_tags = True


class LineAdmin(admin.ModelAdmin):
    list_display = ('number', 'section')
    inlines = (MeasureInline,)


class LineInline(admin.StackedInline):

    model = Line
    extra = 0
    readonly_fields = ('change',)

    def change(self, instance):

        if instance.id:
            change_url = urlresolvers.reverse(
                'admin:chordcharts_line_change', args=(instance.id,)
            )

            return '<a class="changelink" href="{}">Change</a>'.format(
                change_url)

        else:
            return 'Save the section first before editing the line.'

    change.allow_tags = True


class SectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'chart', 'key', 'number', 'key')
    inlines = (LineInline,)


class SectionInline(admin.StackedInline):

    model = Section
    extra = 0
    readonly_fields = ('change',)

    def change(self, instance):

        if instance.id:
            change_url = urlresolvers.reverse(
                'admin:chordcharts_section_change', args=(instance.id,)
            )

            return '<a class="changelink" href="{}">Change</a>'.format(
                change_url)

        else:
            return 'Save the chart first before editing the section.'

    change.allow_tags = True


class ChartAdmin(admin.ModelAdmin):
    list_display = ('song', 'key')
    inlines = (SectionInline,)


class ChordTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'symbol', 'chord_output', 'order')


class NoteInline(admin.TabularInline):
    model = Note
    extra = 0


class KeyAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'slug', 'tonic', 'tonality', 'distance_from_c', 'order'
    )
    prepopulated_fields = {'slug': ('name',)}
    inlines = (NoteInline,)


class TimeSignatureAdmin(admin.ModelAdmin):
    pass


admin.site.register(Chart, ChartAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(Line, LineAdmin)
admin.site.register(Measure, MeasureAdmin)
admin.site.register(ChordType, ChordTypeAdmin)
admin.site.register(Key, KeyAdmin)
admin.site.register(TimeSignature, TimeSignatureAdmin)
