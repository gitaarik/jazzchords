# coding=utf8
import string

from django.db import models
from django.core.exceptions import ObjectDoesNotExist

from songs.models import Song
from .charts.boxed import BoxedChart, BoxedChartSection
from .exceptions import SectionKeyDoesNotExist


class Key(models.Model):
    '''
    The musical key.

    This will define what notes will be used for the relative note indications
    in the chart.

    Sets on this object:
        note_set - The notes for this key.
    '''

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
    tone = models.CharField(max_length=2, choices=NOTES_CHOICES)
    tonality = models.PositiveSmallIntegerField(choices=TONALITY_CHOICES,
        help_text='''The tonality for this key. Will be used for finding the
        right key when transposing, because we want to transpose to the same
        tonality.''')
    distance_from_c = models.PositiveSmallIntegerField(help_text=
        '''The distance the root note from this key has from the C note. This
        should be expressed in the amount of half notes to go up to reach the
        C. If the root not is C this will be 0. It will be used for finding the
        right key when transposing.''')

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ('tone', 'name')

    def note(self, distance_from_root, accidental=0):
        '''
        Get the note of this key at `distance_from_root`.
        '''
        return self.note_set.get(distance_from_root=distance_from_root).name


class Note(models.Model):
    '''
    A note belonging to a certain key.

    This actually includes all 12 notes. Only when `key_note` is True, the note
    is really a note IN the key. The other notes are specified so that we won't
    have to guess how to represent an out-of-key note. This way all charts will
    use the same representation of out-of-key notes.
    '''

    name = models.CharField(max_length=2, help_text=
        '''The name for the note. Should be a letter from A to G and possibly a
        flat (b) or sharp (#) sign.''')
    key = models.ForeignKey(Key, help_text=
        '''The key this note belongs to. Doesn't necessarily have to be a note
        IN the key. We also specify out-of-key notes so the system won't have
        to guess how to represend them.''')
    distance_from_root = models.PositiveSmallIntegerField(help_text=
        '''The distance this note has from the root note of the associated key.
        If this IS the root note, the distance is 0.''')
    key_note = models.BooleanField(help_text='''Indicates if this note is a
        note that really is IN the key. We also specify out-of-key notes so the
        system won't have to guess how to represend them.''')

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ('distance_from_root',)


class Chart(models.Model):
    '''
    A chord chart.

    All information about the chord chart is accessible on this object.

    Sets on this object:
        section_set - The sections on this chart.
    '''

    song = models.ForeignKey(Song, help_text='The song this chart descripes.')
    key = models.ForeignKey(Key, help_text='''The key the chart is in. If the
        some sections of the song have deviating keys you can overwrite this in
        the section.''')

    def __unicode__(self):
        return unicode(self.song)

    def boxed_chart(self):
        '''
        Get the boxed chart representation for this chart.
        In the future we could add different types of chart representations.
        The boxed chart is just the first one we created.
        '''
        return BoxedChart(self)


class Section(models.Model):
    '''
    A section in a chart.

    Sections are used to divide a chart in differen parts, generally related
    to the different parts in a song. They can have a deviating key from the
    chart, indicated by `key_distance_from_chart`.

    Sets on this object:
        item_set - The items in this section. These hold the chords and
                   information about them, like position, duration and more.
    '''

    chart = models.ForeignKey(Chart, help_text='The chart this section is in.')
    key_distance_from_chart = models.PositiveSmallIntegerField(default=0,
        help_text='''The distance (in half notes) the key of this section is
        relative to the key of the chart. If the section is in the same key
        this will be 0.''')
    line_width = models.PositiveSmallIntegerField(default=8, help_text=
        '''The default width for a line in the section. The definition of a
        line is specified by the kind of chart (like BoxedChart) but it is
        generally the width of beats the line allows, so that every line
        has the same length in time musicwise. This is usually 4 or a multiple
        of 4.''')
    position = models.PositiveSmallIntegerField(help_text=
        '''The position the section has in the chart. This will be used to put
        all the sections in a correct order. Should start from 0.''')

    def __unicode__(self):
        return self.name()

    class Meta:
        ordering = ('position',)
        unique_together = ('chart', 'position')

    def name(self):
        '''
        The name of the section. According to `self.position` it will get an
        uppercase letter from the alphabet.
        0 = A, 1 = B, 2 = C, etc.
        '''
        return string.uppercase[self.position]

    def key(self):
        '''
        The key the section is in. This will be based on the key of the chart
        and `self.key_distance_from_chart`.
        '''

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
        '''
        Get the boxed chart for this section. This is a way to represent the
        section in a boxed format.
        '''
        return BoxedChartSection(self)


class ChordType(models.Model):
    '''
    The type of a chord.

    This defines the intervals of the chord. For example, Major, Major Seven,
    Ninth, Diminished etc.

    This definition is only used to be understandable for humans (who will read
    the chord charts) and not the code. There's no need for the code to
    understand this because at the moment there are no features that need this.
    '''

    name = models.CharField(max_length=50, help_text=
        '''The human understandable name that descripes the chord type. For
        example: Major, Major Seven, Ninth, Diminished etc.''')
    symbol = models.CharField(max_length=10, blank=True, help_text=
        '''The symbol for the chord type.  For example: 7 (for Seventh), 9 (for
        Ninth), m (for Minor) This will be used for the chord representation in
        the chart. Use any symbol you think would be appropriate to represent
        the chord.''')

    def __unicode__(self):
        return u'{} ({})'.format(self.name, self.symbol)

    class Meta:
        ordering = ('name',)


class Item(models.Model):
    '''
    An item in a section of a chart.

    This contains the chords and information about it, like position, duration
    and more.
    '''

    section = models.ForeignKey(Section, help_text=
        '''The section this item belongs to.''')
    position = models.PositiveSmallIntegerField(help_text='''The position for
        the item. Will be used to determine the order of the items.''')
    beats = models.PositiveSmallIntegerField(default=4, help_text='''
        The number of beats the item should be played. The current chord chart
        representations only support 4/4 measures.''')
    chord_type = models.ForeignKey(ChordType, help_text='''The type of the
        chord. This defines the intervals inside the chord.''')
    chord_pitch = models.PositiveSmallIntegerField(help_text=
        '''The relative pitch for the chord. This is the amount of half notes
        the chord note is away from the root of the key the item will be
        presented in. These half steps should be upwards in the scale.''')
    alternative_bass = models.BooleanField(help_text='''Indicates if the chord
        has an alternative tone in the bass.''')
    alternative_bass_pitch = models.PositiveSmallIntegerField(default=0,
        help_text='''The alternative bass tone in the chord. As with the Chord
        Pitch, it is the amount of half notes the chord note is away from the
        root of the key the item will be presented in. These half steps should
        be upwards in the scale. It will only be used if `Use Alternative Bass`
        is set.''')

    def __unicode__(self):
        return self.chord_notation()

    class Meta:
        ordering = ('position',)
        unique_together = ('section', 'position')

    def chord_notation(self):
        '''
        The notation for the chord.

        This is a build up with these components:
        - The chord tone (based on the key), this includes any flats or sharps
          too.
        - The symbol of the chord type.
        - Possibly the alternative base note (based on the key).
        '''

        # It could be that the section key doesn't exist because the section's
        # key deviates (by interval) from the charts key.
        try:
            section_key = self.section.key()
        except SectionKeyDoesNotExist:
            note = u'�'
            alt_base = u''
        else:

            note = section_key.note(self.chord_pitch)

            if self.alternative_bass:
                alt_base = u'/{}'.format(
                    section_key.note(self.alternative_bass_pitch))
            else:
                alt_base = ''

        return u''.join([
            note,
            self.chord_type.symbol,
            alt_base])
