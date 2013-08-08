# coding=utf8
import string

from django.db import models
from django.core.exceptions import ObjectDoesNotExist

from songs.models import Song
from .charts.boxed import BoxedChart, BoxedChartSection
from .exceptions import SectionKeyDoesNotExist


class Key(models.Model):
    """
    The musical key.

    This will define what notes will be used for the relative note indications
    in the chart.

    Sets on this object:
        note_set - The notes for this key.
    """

    NOTES_CHOICES = (
        ('Cb', 'Cb'), ('C', 'C'), ('C#', 'C#'), ('Db', 'Db'), ('D', 'D'),
        ('D#', 'D#'), ('Eb', 'Eb'), ('E', 'E'), ('E#', 'E#'), ('Fb', 'Fb'),
        ('F', 'F'), ('F#', 'F#'), ('Gb', 'Gb'), ('G', 'G'), ('G#', 'G#'),
        ('Ab', 'Ab'), ('A', 'A'), ('A#', 'A#'), ('Bb', 'Bb'), ('B', 'B'),
        ('B#', 'B#')
    )

    TONALITY_MAJOR = 1
    TONALITY_MINOR = 1
    TONALITY_CHOICES = (
        (TONALITY_MAJOR, u'Major'),
        (TONALITY_MINOR, u'Minor')
    )

    name = models.CharField(max_length=25, help_text=
        'Appropriate name for this key.')
    slug = models.SlugField(max_length=25, unique=True, help_text=
        """Lowercase name for the key with dashes instead of spaces. Will be
        used in URL's.""")
    tone = models.CharField(max_length=2, choices=NOTES_CHOICES, help_text=
        """The tone for the key. Will be used for displaying the possible keys
        for a certain tonality.""")
    tonality = models.PositiveSmallIntegerField(choices=TONALITY_CHOICES,
        help_text="""The tonality for this key. Will be used for finding the
        right key when transposing, because we want to transpose to the same
        tonality.""")
    distance_from_c = models.PositiveSmallIntegerField(help_text=
        """The distance the root note from this key has from the C note. This
        should be expressed in the amount of half notes to go up to reach the
        C. If the root not is C this will be 0. It will be used for finding the
        right key when transposing.""")
    order = models.PositiveSmallIntegerField(help_text="""The order the keys of
        a certain tonality should appear in.""")

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ('order',)
        unique_together = ('tonality', 'order')

    def client_data(self):
        return {
            'notes': {note.pk: note.client_data() for note in self.note_set.all()}
        }

    def note(self, distance_from_root, accidental=0):
        """
        Get the note of this key at `distance_from_root`.
        """
        return self.note_set.get(distance_from_root=distance_from_root)


class Note(models.Model):
    """
    A note belonging to a certain key.

    This actually includes all 12 notes. Only when `key_note` is True, the note
    is really a note IN the key. The other notes are specified so that we won't
    have to guess how to represent an out-of-key note. This way all charts will
    use the same representation of out-of-key notes.
    """

    name = models.CharField(max_length=2, help_text=
        """The name for the note. Should be a letter from A to G and possibly a
        flat (b) or sharp (#) sign.""")
    key = models.ForeignKey(Key, help_text=
        """The key this note belongs to. Doesn't necessarily have to be a note
        IN the key. We also specify out-of-key notes so the system won't have
        to guess how to represend them.""")
    distance_from_root = models.PositiveSmallIntegerField(help_text=
        """The distance this note has from the root note of the associated key.
        If this IS the root note, the distance is 0.""")
    key_note = models.BooleanField(help_text="""Indicates if this note is a
        note that really is IN the key. We also specify out-of-key notes so the
        system won't have to guess how to represend them.""")

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ('distance_from_root',)

    def client_data(self):
        return {
            'id': self.pk,
            'distance_from_root': self.distance_from_root,
            'name': self.name,
        }


class ChordType(models.Model):
    """
    The type of a chord.

    This defines the intervals of the chord. For example, Major, Major Seven,
    Ninth, Diminished etc.

    This definition is only used to be understandable for humans (who will read
    the chord charts) and not the code. There's no need for the code to
    understand this because at the moment there are no features that need this.
    """

    name = models.CharField(max_length=50, help_text=
        """The human understandable name that descripes the chord type. For
        example: Major, Major Seven, Ninth, Diminished etc.""")
    symbol = models.CharField(max_length=10, help_text="""The symbol for the
        chord type. For example: m (for Major), m (for Minor), 7 (for Seventh).
        This will be used for choosing a chord type in the edit widget.""")
    chord_output = models.CharField(max_length=10, blank=True, help_text=
        """The way the symbol will be displayed when used in a chord. Usually
        this is the same as the normal symbol, but for some chords it might be
        different. For example, a Major chord is usually written without a
        symbol. This will be used for the chord representation in the chart.
        """)
    order = models.PositiveSmallIntegerField(help_text="""The order in which
        the chord types will appear. This is used in the edit widget. More used
        chords should appear before lesser used chords.""")

    def __unicode__(self):
        if self.symbol:
            return u'{} ({})'.format(self.name, self.symbol)
        else:
            return u'{}'.format(self.name)

    class Meta:
        ordering = ('order',)

    def client_data(self):
        return {
            'id': self.pk,
            'name': self.name,
            'symbol': self.symbol,
            'chord_output': self.chord_output
        }


class Chart(models.Model):
    """
    A chord chart.

    All information about the chord chart is accessible on this object.

    Sets on this object:
        section_set - The sections on this chart.
    """

    song = models.ForeignKey(Song, help_text='The song this chart descripes.')
    key = models.ForeignKey(Key, help_text="""The key the chart is in. If the
        some sections of the song have deviating keys you can overwrite this in
        the section.""")

    def __unicode__(self):
        return unicode(self.song)

    def boxed_chart(self):
        """
        Get the boxed chart representation for this chart.
        In the future we could add different types of chart representations.
        The boxed chart is just the first one we created.
        """
        return BoxedChart(self)


class Section(models.Model):
    """
    A section in a chart.

    Sections are used to divide a chart in differen parts, generally related
    to the different parts in a song. They can have a deviating key from the
    chart, indicated by `key_distance_from_chart`.

    Sets on this object:
        item_set - The items in this section. These hold the chords and
                   information about them, like position, duration and more.
    """

    chart = models.ForeignKey(Chart, help_text='The chart this section is in.')
    key_distance_from_chart = models.PositiveSmallIntegerField(default=0,
        help_text="""The distance (in half notes) the key of this section is
        relative to the key of the chart. If the section is in the same key
        this will be 0.""")
    line_width = models.PositiveSmallIntegerField(default=8, help_text=
        """The default width for a line in the section. The definition of a
        line is specified by the kind of chart (like BoxedChart) but it is
        generally the width of beats the line allows, so that every line
        has the same length in time musicwise. This is usually 4 or a multiple
        of 4.""")
    position = models.PositiveSmallIntegerField(help_text=
        """The position the section has in the chart. This will be used to put
        all the sections in a correct order. Should start from 0.""")
    alt_title = models.CharField(max_length=25, blank=True, help_text="""
        Alternative title for the section. Normally a section get's assigned a
        letter (starting with A, next B etc.) which is displayed left of the
        section's boxed chart. If you fill in this "alternative title" this
        title will be shown on top of the section's boxed chart. This is
        appropriate for an intro, outro or maybe a bridge which isn't a
        regularry repeating section in the song.""")

    def __unicode__(self):
        return self.name()

    class Meta:
        ordering = ('position',)
        unique_together = ('chart', 'position')

    def name(self):
        """
        The name of the section. According to `self.position` it will get an
        uppercase letter from the alphabet.
        0 = A, 1 = B, 2 = C, etc.
        """
        if self.alt_title:
            return self.alt_title
        else:
            return string.uppercase[self.chart.section_set.filter(alt_title='', position__lt=self.position).count()]

    def key(self):
        """
        The key the section is in. This will be based on the key of the chart
        and `self.key_distance_from_chart`.
        """

        if self.key_distance_from_chart == 0:
            return self.chart.key
        else:

            key_distance_from_c = (
                self.chart.key.distance_from_c +
                self.key_distance_from_chart) % 12

            try:
                key = Key.objects.get(
                    distance_from_c=key_distance_from_c,
                    tonality=self.chart.key.tonality)
            except ObjectDoesNotExist:
                raise SectionKeyDoesNotExist

            return key

    def boxed_chart(self):
        """
        Get the boxed chart for this section. This is a way to represent the
        section in a boxed format.
        """
        return BoxedChartSection(self)


class Line(models.Model):
    """
    A line in a section.
    """

    section = models.ForeignKey(Section, help_text=
        """The section this line belongs to.""")

    def key(self):
        """
        The key the line is in.

        This will be the same as the key of the section the line is in.
        """
        return self.section.key()


class Measure(models.Model):
    """
    A measure in a line.
    """

    line = models.ForeignKey(Line, help_text=
        """The line this measure belongs to.""")
    position = models.PositiveSmallIntegerField(help_text="""The position for
        the measure. Will be used to determine the order of the measures.""")
    beat_schema = models.CharField(max_length=13)

    def key(self):
        """
        The key the measure is in.

        This will be the same as the key of the line the measure is in.
        """
        return self.line.key()


class Chord(models.Model):
    """
    A chord in a measure.
    """

    measure = models.ForeignKey(Line, help_text=
        """The measure this chord belongs to.""")
    beats = models.PositiveSmallIntegerField(default=4, help_text="""
        The number of beats the item should be played. The current chord chart
        representations only support 4/4 measures.""")
    chord_type = models.ForeignKey(ChordType, help_text="""The type of the
        chord. This defines the intervals inside the chord.""")
    chord_pitch = models.PositiveSmallIntegerField(help_text=
        """The relative pitch for the chord. This is the amount of half notes
        the chord note is away from the root of the key the item will be
        presented in. These half steps should be upwards in the scale.""")
    alternative_bass = models.BooleanField(help_text="""Indicates if the chord
        has an alternative tone in the bass.""")
    alternative_bass_pitch = models.PositiveSmallIntegerField(default=0,
        help_text="""The alternative bass tone in the chord. As with the Chord
        Pitch, it is the amount of half notes the chord note is away from the
        root of the key the item will be presented in. These half steps should
        be upwards in the scale. It will only be used if `Use Alternative Bass`
        is set.""")
    position = models.PositiveSmallIntegerField(help_text="""The position for
        the chord. Will be used to determine the order of the chords.""")

    def __unicode__(self):
        return self.chord_notation()

    class Meta:
        ordering = ('position',)
        unique_together = ('measure', 'position')

    def chord_notation(self):
        """
        The notation for the chord.

        This is a build up with these components:
        - The chord note, this includes any flats or sharps too.
        - The symbol of the chord type.
        - Possibly the alternative base note.
        """

        if self.alternative_bass:
            return u''.join([
                self.note().name,
                self.chord_type.chord_output,
                '/',
                self.alternative_base_note().name])
        else:
            return u''.join([self.note().name, self.chord_type.chord_output])

    def key(self):
        """
        The key the chord is in.

        This will be the same as the key of the measure the chord is in.
        """
        return self.measure.key()

    def note(self):
        """
        The note for the chord.
        """
        return self.key().note(self.chord_pitch)

    def alternative_base_note(self):
        """
        The alternative bass note for this chord.

        If there is no alternative bass note, it will return `False`.
        """

        if self.alternative_bass:
            return self.key().note(self.alternative_bass_pitch)
        else:
            return False
