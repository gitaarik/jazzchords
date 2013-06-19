from django.core import urlresolvers
from django.contrib import admin

from models import Chart, Section, ChordType, Item, Pitch, Key


class ItemAdmin(admin.TabularInline):
    model = Item
    extra = 0


class SectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'chart', 'key', 'position',
        'key_distance_from_chart')
    inlines = (ItemAdmin,)


class SectionInline(admin.StackedInline):

    model = Section
    extra = 0
    readonly_fields = ('change',)

    def change(self, instance):

        if instance.id:
            # Replace "myapp" with the name of the app containing
            # your Certificate model:
            change_chord_item_url = urlresolvers.reverse(
                'admin:chordcharts_section_change', args=(instance.id,)
            )

            return '<a class="changelink" href="{}">Change</a>'.format(
                change_chord_item_url)

        else:
            return 'Save the chart first before editing the section.'

    change.allow_tags = True


class ChartAdmin(admin.ModelAdmin):
    list_display = ('song', 'key')
    inlines = (SectionInline,)


class ChordTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'symbol')


class PitchInline(admin.TabularInline):
    model = Pitch
    extra = 0


class KeyAdmin(admin.ModelAdmin):
    inlines = (PitchInline,)


admin.site.register(Chart, ChartAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(ChordType, ChordTypeAdmin)
admin.site.register(Key, KeyAdmin)
