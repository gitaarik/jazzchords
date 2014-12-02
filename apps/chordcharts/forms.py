from django.forms import ModelForm, CharField
from songs.models import Song
from songs.fields import SongNameField
from .fields import KeyTonicField, KeyTonalityField
from .models import Key, ChordType, Chart, Section, Line, Measure, Chord


class CreateChartForm(ModelForm):

    song_name = SongNameField()
    key_tonic = KeyTonicField()
    key_tonality = KeyTonalityField()

    class Meta:
        model = Chart
        fields = ['short_description', 'video_url', 'lyrics_url']

    def save(self, user, *args, **kwargs):

        self.instance.owner = user
        self.instance.song = self.get_song()
        key = Key.objects.get(
            tonic=self.cleaned_data['key_tonic'],
            tonality=self.cleaned_data['key_tonality']
        )

        super().save(*args, **kwargs)
        self.add_first_section(self.instance, key)

        return self.instance

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

    def add_first_section(self, chart, key):
        """
        Add a section containing a line containing a measure containing
        a chord to the given `chart`.
        """

        section = Section(chart=chart, key=key)
        section.save()

        line = Line(section=section)
        line.save()

        measure = Measure(line=line)
        measure.save()

        if section.key.tonality == Key.TONALITY_MAJOR:
            chord_type = ChordType.objects.get(name='Major')
        else:
            chord_type = ChordType.objects.get(name='Minor')

        chord = Chord(measure=measure, chord_type=chord_type)
        chord.save()
