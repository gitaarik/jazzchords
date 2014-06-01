from django.core.exceptions import ObjectDoesNotExist, ValidationError
from ..models import Key, Chart, Section, Line, Measure, Chord
from songs.models import Song


class FormErrors(Exception):

    def __init__(self, errors):
        self.errors = errors
        super().__init__()


def process_new_chart_post(request):
    '''
    'key_tonality': 'Major',
    'key_tone': 'C',
    'lyrics_url': 'jo',
    'short_description': 'desc',
    'song_name': 'Test',
    'video_url': 'ho'
    '''

    song_name = request.POST['song_name']
    key_tone = request.POST['key_tone']
    key_tonality = request.POST['key_tonality']
    short_description = request.POST['short_description']
    video_url = request.POST['video_url']
    lyrics_url = request.POST['lyrics_url']

    errors = []

    if not song_name:
        errors.append('empty_song_name')

    if key_tonality == 'Major':
        tonality = Key.TONALITY_MAJOR
    elif key_tonality == 'Minor':
        tonality = Key.TONALITY_MINOR
    else:
        tonality = None

    try:
        key = Key.objects.get(tone=key_tone, tonality=tonality)
    except ObjectDoesNotExist:
        errors.append('invalid_key')

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
            errors.append('invalid_song_name')

    if len(errors):
        raise FormErrors(errors=errors)

    if new_song:
        song.save()

    chart = Chart(
        song=song,
        key=key,
        short_description=short_description,
        video_url=video_url,
        lyrics_url=lyrics_url
    )

    try:
        chart.full_clean()
    except ValidationError:
        errors.append('chart_invalid')

    if len(errors):
        raise FormErrors(errors=errors)

    chart.save()

    section = Section(chart=chart)
    section.save()

    line = Line(section=section)
    line.save()

    measure = Measure(line=line)
    measure.save()

    chord = Chord(measure=measure)
    chord.save()

    return chart
