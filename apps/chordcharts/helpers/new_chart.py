from django.core.exceptions import ObjectDoesNotExist, ValidationError
from ..models import Key, Chart, Section, Line, Measure, Chord, ChordType
from songs.models import Song


class FormErrors(Exception):

    def __init__(self, errors):
        self.errors = errors
        super().__init__()


class ProcessNewChartPost():

    def __init__(self, request):
        self.errors = []
        self.request = request

    def process(self):
        """
        Processes a POST request from the new chart form. Returns the new
        chart on success. Raises `FormErrors` on failure.
        """

        chart = self.get_chart()
        key = self.get_key()

        if len(self.errors):
            raise FormErrors(errors=self.errors)

        chart.save()
        self.add_first_section(chart, key)

        return chart

    def get_chart(self):
        """
        Returns a new unsaved chart object.
        """

        song = self.get_song()

        if not song:
            # We can't create a chart without a song.
            return False
        else:

            short_description = self.request.POST['short_description']
            video_url = self.request.POST['video_url']
            lyrics_url = self.request.POST['lyrics_url']

            chart = Chart(
                song=song,
                short_description=short_description,
                video_url=video_url,
                lyrics_url=lyrics_url
            )

            try:
                chart.full_clean()
            except ValidationError:
                self.errors.append('chart_invalid')

            return chart

    def get_song(self):
        """
        Returns a existing or newly created song.
        """

        song_name = self.request.POST['song_name']

        if not song_name:
            self.errors.append('empty_song_name')
            return False
        else:

            songs = Song.objects.filter(name__iexact=song_name)

            if songs.count() > 0:
                new_song = False
                song = songs[0]
            else:

                new_song = True
                song = Song(name=song_name)

                try:
                    song.full_clean()
                except ValidationError:
                    self.errors.append('invalid_song_name')

            if len(self.errors):
                raise FormErrors(errors=self.errors)

            if new_song:
                song.save()

            return song

    def get_key(self):
        """
        Returns the key.
        """

        key_tonic = self.request.POST.get('key_tonic')
        key_tonality = self.request.POST.get('key_tonality')

        if key_tonality == 'Major':
            tonality = Key.TONALITY_MAJOR
        elif key_tonality == 'Minor':
            tonality = Key.TONALITY_MINOR
        else:
            tonality = None

        try:
            key = Key.objects.get(tonic=key_tonic, tonality=tonality)
        except ObjectDoesNotExist:
            self.errors.append('invalid_key')
            return False
        else:
            return key

    def add_first_section(self, chart, key):
        """
        Add a section containing a line containing a measure containing
        a chord.
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
