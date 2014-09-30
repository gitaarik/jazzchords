from django.forms import ModelForm, CharField
from songs.models import Song
from songs.fields import SongNameField
from .fields import KeyTonicField, KeyTonalityField
from .models import Chart


class CreateChartForm(ModelForm):

    song_name = SongNameField()
    key_tonic = KeyTonicField()
    key_tonality = KeyTonalityField()

    class Meta:
        model = Chart
        fields = ['short_description', 'video_url', 'lyrics_url']

    def save(self, *args, **kwargs):

        self.instance.song = self.get_song()

        super().save(*args, **kwargs)

    def get_song(self):
        """
        Returns a existing or newly created song.
        """

        song_name = self.cleaned_data['song_name']
        songs = Song.objects.filter(name__iexact=song_name)

        if songs.count() > 0:
            song = songs[0]
        else:
            song = Song(name=song_name)
            song.save()

        return song
