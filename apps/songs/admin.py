from django.contrib import admin
from .models import Song


class SongAdmin(admin.ModelAdmin):
    pass


admin.site.register(Song, SongAdmin)
