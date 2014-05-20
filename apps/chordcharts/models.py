# coding=utf8
import string

from django.db import models
from django.core.exceptions import ObjectDoesNotExist

from songs.models import Song
from .exceptions import SectionKeyDoesNotExist
from .settings import BOXED_CHART


class Key(models.Model):
    """
    The musical key.

    This will define what notes will be used for the relative note indications
    in the chart.

    Sets on this model:
        notes - The notes for this key.
    """

    NOTES_CHOICES = (
        ('Cb', 'Cb'), ('C', 'C'), ('C#', 'C#'), ('Db', 'Db'), ('D', 'D'),
        ('D#', 'D#'), ('Eb', 'Eb'), ('E', 'E'), ('E#', 'E#'), ('Fb', 'Fb'),
        ('F', 'F'), ('F#', 'F#'), ('Gb', 'Gb'), ('G', 'G'), ('G#', 'G#'),
        ('Ab', 'Ab'), ('A', 'A'), ('A#', 'A#'), ('Bb', 'Bb'), ('B', 'B'),
        ('B#', 'B#')
    )

    TONALITY_MAJOR = 1
    TONALITY_MINOR = 2
    TONALITY_CHOICES = (
        (TONALITY_MAJOR, "Major"),
        (TONALITY_MINOR, "Minor")
    )

    name = models.CharField(
        max_length=25,
        help_text="Appropriate name for this key."
    )
    slug = models.SlugField(
        max_length=25,
        unique=True,
        help_text=(
            """Lowercase name for the key with dashes instead of spaces. Will
            be used in URL's."""
        )
    )

    tone = models.CharField(
        max_length=2,
        choices=NOTES_CHOICES,
        help_text=(
            """The tone for the key. Will be used for displaying the possible
            keys for a certain tonality."""
        )
    )

    tonality = models.PositiveSmallIntegerField(
        choices=TONALITY_CHOICES,
        help_text=(
            """The tonality for this key. Will be used for finding the right
            key when transposing, because we want to transpose to the same
            tonality."""
        )
    )

    distance_from_c = models.PositiveSmallIntegerField(
        help_text=(
            """The distance the root note from this key has from the C note.
            This should be expressed in the amount of half notes to go up to
            reach the C. If the root not is C this will be 0. It will be used
            for finding the right key when transposing."""
        )
    )

    order = models.PositiveSmallIntegerField(
        help_text="The order the keys of a certain tonality should appear in."
    )

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('order',)
        unique_together = ('tonality', 'order')

    def client_data(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'tonality': self.tonality,
            'notes': [note.client_data() for note in self.notes.all()]
        }

    def note(self, distance_from_root, accidental=0):
        """
        Get the note of this key at `distance_from_root`.
        """
        return self.notes.get(distance_from_root=distance_from_root)


class Note(models.Model):
    """
    A note belonging to a certain key.

    This actually includes all 12 notes. Only when `key_note` is True, the note
    is really a note IN the key. The other notes are specified so that we won't
    have to guess how to represent an out-of-key note. This way all charts will
    use the same representation of out-of-key notes.
    """

    key = models.ForeignKey(
        Key,
        related_name='notes',
        help_text=(
            """The key this note belongs to. Doesn't necessarily have to be a
            note IN the key. We also specify out-of-key notes so the system
            won't have to guess how to represend them."""
        )
    )

    name = models.CharField(
        max_length=2,
        help_text=(
            """The name for the note. Should be a letter from A to G and
            possibly a flat (b) or sharp (#) sign."""
        )
    )

    distance_from_root = models.PositiveSmallIntegerField(
        help_text=(
            """The distance this note has from the root note of the associated
            key. If this IS the root note, the distance is 0."""
        )
    )

    key_note = models.BooleanField(
        default=False,
        help_text=(
            """Indicates if this note is a note that really is IN the key. We
            also specify out-of-key notes so the system won't have to guess how
            to represend them."""
        )
    )

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('distance_from_root',)

    def client_data(self):
        return {
            'id': self.id,
            'name': self.name,
            'distance_from_root': self.distance_from_root
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

    name = models.CharField(
        max_length=50,
        help_text=(
            """The human understandable name that descripes the chord type. For
            example: Major, Major Seven, Ninth, Diminished etc."""
        )
    )

    symbol = models.CharField(
        max_length=10,
        help_text=(
            """The symbol for the chord type. For example: m (for Major), m
            (for Minor), 7 (for Seventh). This will be used for choosing a
            chord type in the edit widget."""
        )
    )

    chord_output = models.CharField(
        max_length=10,
        blank=True,
        help_text=(
            """The way the symbol will be displayed when used in a chord.
            Usually this is the same as the normal symbol, but for some chords
            it might be different. For example, a Major chord is usually
            written without a symbol. This will be used for the chord
            representation in the chart.
            """
        )
    )

    order = models.PositiveSmallIntegerField(
        help_text=(
            """The order in which the chord types will appear. This is used in
            the edit widget. More used chords should appear before lesser used
            chords."""
        )
    )

    def __str__(self):
        if self.symbol:
            return u"{} ({})".format(self.name, self.symbol)
        else:
            return u"{}".format(self.name)

    class Meta:
        ordering = ('order',)

    def client_data(self):
        return {
            'id': self.id,
            'name': self.name,
            'symbol': self.symbol,
            'chord_output': self.chord_output
        }


class Chart(models.Model):
    """
    A chord chart.

    All information about the chord chart is accessible on this object.

    Sets on this model:
        sections - The sections on this chart.
    """

    song = models.ForeignKey(Song, help_text="The song this chart descripes.")
    key = models.ForeignKey(
        Key,
        help_text=(
            """The key the chart is in. If the some sections of the song have
            deviating keys you can overwrite this in the section."""
        )
    )

    def __str__(self):
        return str(self.song)

    def client_data(self):
        return {
            'id': self.id,
            'song': self.song.client_data(),
            'key': self.key.client_data(),
            'sections': [s.client_data() for s in self.sections.all()]
        }

    def cleanup(self):
        """
        Cleans up the chart.

        Cleans up the model by removing empty children and other objects
        that aren't needed anymore. Also makes sure there are no gaps
        between models that have a `number` attribute.

        Empty children are:
            - sections that don't have any lines
            - lines that don't have any measures
            - measures that don't have any chords
        """

        for section in self.sections.all():
            section.cleanup()

        number = 0

        for section in self.sections.all():
            number += 1
            section.number = number
            section.save()


class TimeSignature(models.Model):

    beats = models.PositiveSmallIntegerField()
    beat_unit = models.PositiveSmallIntegerField()

    def __str__(self):
        return '{}/{}'.format(self.beats, self.beat_unit)


class Section(models.Model):
    """
    A section in a chart.

    Sections are used to divide a chart in differen parts, generally related
    to the different parts in a song. They can have a deviating key from the
    chart, indicated by `key_distance_from_chart`.

    Sets on this model:
        lines - The lines in this section.
    """

    chart = models.ForeignKey(
        Chart,
        related_name='sections',
        help_text="The chart this section is in."
    )

    key_distance_from_chart = models.PositiveSmallIntegerField(
        default=0,
        help_text="""The distance (in half notes) the key of this section is
        relative to the key of the chart. If the section is in the same key
        this will be 0."""
    )

    number = models.PositiveSmallIntegerField(
        help_text=(
            """The section number. Will be used to put the sections in order"""
        )
    )

    alt_name = models.CharField(
        max_length=25,
        blank=True,
        help_text="""Alternative title for the section. Normally a section
        get's assigned a letter (starting with A, next B etc.) which is
        displayed left of the section's boxed chart. If you fill in this
        "alternative title" this title will be shown on top of the section's
        boxed chart. This is appropriate for an intro, outro or maybe a bridge
        which isn't a regularry repeating section in the song."""
    )

    time_signature = models.ForeignKey(TimeSignature)
    show_sidebar = models.BooleanField(default=False)

    def __str__(self):
        return self.name()

    class Meta:
        ordering = ('number',)

    def client_data(self):
        return {
            'id': self.id,
            'key_distance_from_chart': self.key_distance_from_chart,
            'number': self.number,
            'alt_name': self.alt_name,
            'time_signature': self.time_signature.id,
            'show_sidebar': self.show_sidebar,
            'name': self.name(),
            'sequence_letter': self.sequence_letter(),
            'height': self.height(),
            'key_id': self.key().id,
            'key': self.key().client_data(),
            'lines': [l.client_data() for l in self.lines.all()]
        }

    def name(self):
        """
        The name of the section.

        If `alt_name` is set, this is returned, otherwise the
        `sequence_letter()`.
        """
        if self.alt_name:
            return self.alt_name
        else:
            return '{} Section'.format(self.sequence_letter())

    def sequence_letter(self):
        """
        The sequence letter.

        This is a letter representing the section sequence.
        The first section without an `alt_name` will be A, the second B,
        the third C etc.
        """
        return string.ascii_uppercase[
            self.chart.sections.filter(
                alt_name='', number__lt=self.number
            ).count()
        ]

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
                self.key_distance_from_chart
            ) % 12

            try:
                key = Key.objects.get(
                    distance_from_c=key_distance_from_c,
                    tonality=self.chart.key.tonality)
            except ObjectDoesNotExist:
                raise SectionKeyDoesNotExist

            return key

    def height(self):
        return ((
            self.lines.count() *
            (BOXED_CHART['box_height'] + BOXED_CHART['border_width'])
        ) + BOXED_CHART['border_width'])

    def cleanup(self):
        """
        Cleans up the model by removing empty children and other objects
        that aren't needed anymore.

        Empty children are:
            - lines that don't have any measures
            - measures that don't have any chords
        """
        for line in self.lines.all():
            line.cleanup()

        if self.lines.count() == 0:
            self.delete()


class Line(models.Model):
    """
    A line in a section.

    A line is a collection of measures that should be presented on one phisical
    line. A line usually contains 8 measures, but can be shorter (but not
    longer).

    Sets on this model:
        measures - The measures in this line.
    """

    LETTER_CHOICES = (
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
        ('E', 'E'),
        ('F', 'F'),
    )

    section = models.ForeignKey(
        Section,
        related_name='lines',
        help_text="""The section this line belongs to."""
    )

    number = models.PositiveSmallIntegerField(
        help_text=(
            """The number for the line. Will be used to determine the order of
            the lines."""
        )
    )

    letter = models.CharField(
        max_length=1,
        default='A',
        choices=LETTER_CHOICES,
        help_text=(
            """The letter the line has. This will show up in the sidebar of the
            section"""
        )
    )

    def __str__(self):
        return "Line {}".format(self.number)

    class Meta:
        ordering = ('number',)

    def client_data(self):
        return {
            'id': self.id,
            'number': self.number,
            'letter': self.letter,
            'measures': [m.client_data() for m in self.measures.all()]
        }

    def key(self):
        """
        The key the line is in.

        This will be the same as the key of the section the line is
        in.
        """
        return self.section.key()

    def time_signature(self):
        """
        The time signature of this line.

        This will be the same as the time signature of the section
        the line is in.
        """
        return self.section.time_signature

    def cleanup(self):
        """
        Cleans up the model by removing empty children and other objects
        that aren't needed anymore.

        Empty children are:
            - measures that don't have any chords
        """
        for measure in self.measures.all():
            measure.cleanup()

        if self.measures.count() == 0:
            self.delete()


class Measure(models.Model):
    """
    A measure in a line.

    Represents a musical measure (or bar).

    Sets on this model:
        chords - The chords in this measure.
    """

    line = models.ForeignKey(
        Line,
        related_name='measures',
        help_text="""The line this measure belongs to."""
    )

    number = models.PositiveSmallIntegerField(
        help_text=(
            """The number for the measure. Will be used to determine the order
            of the measures."""
        )
    )

    beat_schema = models.CharField(
        max_length=13,
        help_text=(
            """The type of beatschema for this measure. This is related to the
            chords that are in the measure. If the measure has one chord that
            is played for 4 beats, the beatschema is "4", if the measure has
            two chords that are both played for 2 beats, the beatschema is
            "2-2", if the measure has three chords where the first one is
            played 2 beats and the other two one 1 beat, the beatschema is
            "2-1-1" etc."""
        )
    )

    def __str__(self):
        return "Measure {}".format(self.number)

    class Meta:
        ordering = ('number',)

    def client_data(self):
        return {
            'id': self.id,
            'number': self.number,
            'beat_schema': self.beat_schema,
            'chords': [c.client_data() for c in self.chords.all()]
        }

    def key(self):
        """
        The key the measure is in.

        This will be the same as the key of the line the measure is in.
        """
        return self.line.key()

    def time_signature(self):
        return self.line.time_signature()

    def chords_count(self):
        """
        The amount of chords this measure contains.
        """
        return len(self.beat_schema.split('-'))

    def previous(self):
        """
        Returns the previous measure.
        """
        try:
            return self.line.measures.filter(
                number__lt=self.number).reverse()[0]
        except IndexError:
            return None

    def cleanup(self):
        """
        Removes chords that don't fit in the `beat_schema` of this
        measure.
        """
        self.chords.filter(order__gt=self.chords_count()).delete()
        if self.chords.count() == 0:
            self.delete()


class Chord(models.Model):
    """
    A chord in a measure.
    """

    measure = models.ForeignKey(
        Measure,
        related_name='chords',
        help_text="The measure this chord belongs to."
    )

    beats = models.PositiveSmallIntegerField(
        default=4,
        help_text=(
            """The number of beats the item should be played. The current chord
            chart representations only support 4/4 measures."""
        )
    )

    chord_pitch = models.PositiveSmallIntegerField(
        help_text=(
            """The relative pitch for the chord. This is the amount of half
            notes the chord note is away from the root of the key the item will
            be presented in. These half steps should be upwards in the
            scale."""
        )
    )

    chord_type = models.ForeignKey(
        ChordType,
        help_text=(
            """The type of the chord. This defines the intervals inside the
            chord."""
        )
    )

    alt_bass = models.BooleanField(
        default=False,
        help_text="Indicates if the chord has an alternative tone in the bass."
    )

    alt_bass_pitch = models.PositiveSmallIntegerField(
        default=0,
        help_text=(
            """The alternative bass tone in the chord. As with the Chord Pitch,
            it is the amount of half notes the chord note is away from the root
            of the key the item will be presented in. These half steps should
            be upwards in the scale. It will only be used if `Use Alternative
            Bass` is set."""
        )
    )

    order = models.PositiveSmallIntegerField(
        help_text=(
            """The order for the chord. Will be used to determine the order of
            the chords."""
        )
    )

    def __str__(self):
        return self.chord_notation()

    class Meta:
        ordering = ('order',)
        unique_together = ('measure', 'order')

    def client_data(self):
        return {
            'id': self.id,
            'order': self.order,
            'beats': self.beats,
            'chord_pitch': self.chord_pitch,
            'alt_bass': self.alt_bass,
            'alt_bass_pitch': self.alt_bass_pitch,
            'key_id': self.key().id,
            'note': self.note().client_data(),
            'chord_type_id': self.chord_type.id,
            'alt_bass_note': (
                self.alt_bass_note().client_data()
                if self.alt_bass else False
            ),
            'chart_output': self.chart_output()
        }

    def chord_notation(self):
        """
        The notation for the chord.

        This is a build up with these components:
        - The chord note, this includes any flats or sharps too.
        - The symbol of the chord type.
        - Possibly the alternative bass note.
        """

        if self.alt_bass:
            return u''.join([
                self.note().name,
                self.chord_type.chord_output,
                '/',
                self.alt_bass_note().name])
        else:
            return u''.join([self.note().name, self.chord_type.chord_output])

    def chart_output(self):
        """
        The way the chord will be displayed on the chart. This can either be
        the original chord notation or the repeat sign.
        """

        time_signature_beats = self.time_signature().beats

        if self.beats == time_signature_beats and self.measure.previous():

            prev_chord = self.measure.previous().chords.all()[0]

            if (
                prev_chord.beats == time_signature_beats and
                self.chord_pitch == prev_chord.chord_pitch and
                self.chord_type == prev_chord.chord_type and
                (
                    not self.alt_bass or
                    (
                        self.alt_bass and
                        self.alt_bass_pitch == prev_chord.alt_bass_note
                    )
                )
            ):
                return '%'

        return self.chord_notation()

    def key(self):
        """
        The key the chord is in.

        This will be the same as the key of the measure the chord is in.
        """
        return self.measure.key()

    def time_signature(self):
        return self.measure.time_signature()

    def note(self):
        """
        The note for the chord.
        """
        return self.key().note(self.chord_pitch)

    def alt_bass_note(self):
        """
        The alternative bass note for this chord.

        If there is no alternative bass note, it will return `False`.
        """

        if self.alt_bass:
            return self.key().note(self.alt_bass_pitch)
        else:
            return False
