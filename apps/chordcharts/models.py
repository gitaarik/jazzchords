# coding=utf8
from django.db import models

from core.helpers.number_to_ordinal import number_to_ordinal
from songs.models import Song
from .settings import BOXED_CHART


class Key(models.Model):
    """
    The musical key.

    This will define what notes will be used for the relative note
    indications in the chart.

    Sets on this model:
        notes - The notes for this key.
    """

    TONIC_CHOICES = (
        ('C', 'C'), ('C#', 'C#'), ('D', 'D'), ('E♭', 'E♭'), ('E', 'E'),
        ('F', 'F'), ('F#', 'F#'), ('G', 'G'), ('A♭', 'A♭'), ('A', 'A'),
        ('B♭', 'B♭'), ('B', 'B')
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

    tonic = models.CharField(
        max_length=2,
        choices=TONIC_CHOICES,
        default='C',
        help_text=(
            """The tonic for the key. Will be used for displaying the possible
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
            'tonic': self.tonic,
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

    This actually includes all 12 notes. Only when `key_note` is True,
    the note is really a note IN the key. The other notes are specified
    so that we won't have to guess how to represent an out-of-key note.
    This way all charts will use the same representation of out-of-key
    notes.
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

    This defines the intervals of the chord. For example, Major, Major
    Seven, Ninth, Diminished etc.

    This definition is only used to be understandable for humans (who
    will read the chord charts) and not the code. There's no need for
    the code to understand this because at the moment there are no
    features that need this.
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

    song = models.ForeignKey(Song, related_name='charts')
    short_description = models.CharField(
        max_length=150, default="", blank=True
    )
    video_url = models.CharField(max_length=500, default="", blank=True)
    lyrics_url = models.CharField(max_length=500, default="", blank=True)

    def __str__(self):
        return str(self.song)

    class Meta():
        ordering = ['song__name']

    def client_data(self, edit=False, transpose_to_tonic=None):

        if transpose_to_tonic:
            key = Key.objects.get(
                tonic=transpose_to_tonic,
                tonality=self.key.tonality
            )
            interval = self.get_transpose_interval(transpose_to_tonic)
        else:
            key = self.key
            interval = 0

        sections_client_data = []

        for section in self.sections.all():
            section.transpose_with_interval(interval)
            sections_client_data.append(
                section.client_data(edit=edit)
            )

        return {
            'id': self.id,
            'song': self.song.client_data(),
            'key': key.client_data(),
            'sections': sections_client_data
        }

    @property
    def key(self):
        """
        The key of the chart.

        This is just the key of the first section.
        """
        return self.sections.first().key

    def transpose(self, tonic):
        """
        Transpose the chart to the given `tonic`.

        Will update the tonic of the keys of all sections with the interval
        between the tonic of the key of the first section and the given
        `tonic`.
        """

        interval = self.get_transpose_interval(tonic)

        for section in self.sections.all():
            section.transpose_with_interval(interval)
            section.save()

    def get_transpose_interval(self, tonic):
        """
        Returns the interval in half notes between the given tonic and
        the tonic of the key of the chart (which is the same as the
        tonic of the key of the first section).
        """
        return (
            Key.objects.get(tonic=tonic, tonality=1).distance_from_c -
            self.sections.first().key.distance_from_c
        )

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

    Sections are used to divide a chart in different parts, generally related
    to the different parts in a song.

    Sets on this model:
        lines - The lines in this section.
    """

    chart = models.ForeignKey(
        Chart,
        related_name='sections',
        help_text="The chart this section is in."
    )

    key = models.ForeignKey(
        Key,
        help_text=(
            """The key the chart is in. If the some sections of the song have
            deviating keys you can overwrite this in the section."""
        )
    )

    number = models.PositiveSmallIntegerField(
        default=1,
        help_text=(
            """The section number. Will be used to put the sections in order"""
        )
    )

    title = models.CharField(
        max_length=25,
        blank=True,
        help_text=(
            """Title for the section. If set, will be displayed above the
            section."""
        )
    )

    time_signature = models.ForeignKey(TimeSignature)
    show_sidebar = models.BooleanField(default=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.set_default_time_signature()

    def __str__(self):
        return self.title

    class Meta:
        ordering = ('number',)

    def client_data(self, edit=False):
        return {
            'id': self.id,
            'key': self.key.client_data(),
            'number': self.number,
            'title': self.title,
            'time_signature': self.time_signature.id,
            'show_sidebar': self.show_sidebar,
            'height': self.height,
            'key_id': self.key.id,
            'key': self.key.client_data(),
            'lines': [l.client_data(edit=edit) for l in self.lines.all()]
        }

    @property
    def height(self):
        return ((
            self.lines.count() *
            (BOXED_CHART['box_height'] + BOXED_CHART['border_width'])
        ) + BOXED_CHART['border_width'])

    def set_default_time_signature(self):
        """
        If time_signature isn't set, sets it to 4/4 as a default.
        """

        # If time_signature isn't set, accessing it would give a
        # RelatedObjectDoesNotExist exception. This is a dynamic
        # exception so we can't import it to explicitly check if it was
        # this exception, however, this is the only expected exception
        # in this case.
        try:
            self.time_signature
        except:
            self.time_signature = TimeSignature.objects.get(
                beats=4, beat_unit=4
            )

    def transpose_with_interval(self, interval):
        """
        Transposes the key of the section using the given `interval`
        in half notes.
        """
        self.key = Key.objects.get(
            distance_from_c=(
                (self.key.distance_from_c + interval) % 12
            ),
            tonality=self.key.tonality
        )

    def update_key(self, key):
        """
        Updates the section to the given `key` without transposing the
        chords.
        """

        difference = self.key.distance_from_c - key.distance_from_c
        self.key = key
        self.save()

        for line in self.lines.all():
            for measure in line.measures.all():
                for chord in measure.chords.all():
                    chord.chord_pitch = (chord.chord_pitch + difference) % 12
                    chord.alt_bass_pitch = (
                        (chord.alt_bass_pitch + difference) % 12
                    )
                    chord.save()

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

    A line is a collection of measures that should be presented on one
    phisical line. A line contains max. `settings.LINE_MAX_MEASURES`
    measures, but can be shorter (but not longer).

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
        default=1,
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

    # Preferably don't use this field directly, but use the property
    # `merge_with_next_line`.
    _merge_with_next_line = models.BooleanField(
        db_column='merge_with_next_line',
        default=False,
        help_text=(
            """If this is checked and the next line has the same letter as this
            line, then the two lines will be represented as one subsection. If
            it's not checked, they will be both repretitions of the same
            subsection."""
        )
    )

    def __str__(self):
        return "Line {}".format(self.number)

    class Meta:
        ordering = ('number',)

    @property
    def merge_with_next_line(self):
        """
        Returns a boolean indicating whether this line merges with the
        next line.

        A line only merges with the next one if `_merge_with_next_line`
        is `True`, the section's sidebar is enabled and the next line
        has the same letter as this one.
        """
        return (
            self._merge_with_next_line
            and self.section.show_sidebar
            and self.next_line
            and self.next_line.letter == self.letter
        )

    @merge_with_next_line.setter
    def merge_with_next_line(self, value):
        self._merge_with_next_line = value

    @property
    def merge_with_prev_line(self):
        return self.prev_line.merge_with_next_line

    @property
    def key(self):
        """
        The key the line is in.

        This will be the same as the key of the section the line is
        in.
        """
        return self.section.key

    @property
    def time_signature(self):
        """
        The time signature of this line.

        This will be the same as the time signature of the section
        the line is in.
        """
        return self.section.time_signature

    @property
    def prev_line(self):
        """
        Returns the line preceiding this line.
        """

        prev_lines = self.section.lines.filter(number__lt=self.number)

        if prev_lines:
            return prev_lines.last()
        else:
            return False

    @property
    def next_line(self):
        """
        Returns the line following this line.
        """

        next_lines = self.section.lines.filter(number__gt=self.number)

        if next_lines:
            return next_lines[0]
        else:
            return False

    @property
    def subsection_number(self):
        """
        Returns the number of the subsection this line is in, or `False`
        if the subsection this line is in doesn't have the sidebar
        enabled.

        A subsection is a collection of adjacent lines that have the
        same letter and are merged with each other through the
        `merge_with_next_line` field. This method returns the number of
        the subsection inside the section.
        """

        if not self.section.show_sidebar:
            return False

        subsection_number = 1

        for line in self.section.lines.all():

            if line.number == self.number:
                break

            if line.letter == self.letter and not line.merge_with_next_line:
                subsection_number += 1

        return subsection_number

    @property
    def subsection_line_number(self):
        """
        Returns the subsection line number for this line if this section
        has the sidebar enabled, otherwise returns `False`.

        A subsection is a collection of adjacent lines that have the
        same letter and are merged with each other through the
        `merge_with_next_line` field. This method returns the line
        number inside the subsection.
        """

        if not self.section.show_sidebar:
            return False

        subsection_line_number = 1
        line = self

        while line:

            prev_line = line.prev_line

            if prev_line and prev_line.merge_with_next_line:
                subsection_line_number += 1
            else:
                break

            line = prev_line

        return subsection_line_number

    def client_data(self, edit=False):

        measures = [m.client_data() for m in self.measures.all()]
        repeating_measures = self.repeating_measures_client_data()

        total_measures = len(measures)

        if repeating_measures:
            total_measures += len(repeating_measures['measures'])

        if not edit and repeating_measures:
            measures = measures[len(repeating_measures['measures']):]

        return {
            'id': self.id,
            'number': self.number,
            'letter': self.letter,
            'merge_with_next_line': self.merge_with_next_line,
            'repeating_measures': repeating_measures,
            'measures': measures,
            'total_measures': total_measures
        }

    def repeating_measures_client_data(self):

        repeating_measures = self.repeating_measures()

        if repeating_measures:

            client_data = {
                'measures': list(range(repeating_measures['amount'])),
                'line_letter': repeating_measures['line'].letter,
                'subsection_number': number_to_ordinal(
                    repeating_measures['line'].subsection_number
                ),
                'span_next_line': repeating_measures['span_next_line'],
                'span_prev_line': repeating_measures['span_prev_line']
            }

        else:
            client_data = None

        return client_data

    def repeating_measures(self, context_info=True):
        """
        Returns information about repeating measures if there are any.

        If the first X measures in this line are the same as the first X
        measures in a previous line with the same letter, and within the
        same section, which has the sidebar enabled, this method returns
        a dict with the following keys:

        line            - The line that this line is repeating.
        amount          - The amount of measures this line repeats from
                          `line`.
        span_next_line  - Wether this repeat range spans to the next
                          line.
        span_prev_line  - Wether this repeat range spans to the previous
                          line.

        The `amount` will always be 4 or greater. If there aren't lines
        that have 4 or more repeating measures, this method will return
        `False`.

        If `context_info` is `False`, `span_next_line` and
        `span_prev_line` will be omitted. This is mainly used internally
        to prevent an unending loop.
        """

        def prev_line_valid():
            """
            Returns whether this line can contain repeating measures
            based on the previous line.

            If there is a previous line and it merges with this one, it
            should have repeating measures over the full length of the
            line. Otherwise you'll get repeating measures in the second
            line of a subsection, which is confusing.
            """

            if self.prev_line and self.merge_with_prev_line:

                repeating_measures_prev_line = (
                    self.prev_line.repeating_measures(
                        context_info=False
                    )
                )

                if (
                    not repeating_measures_prev_line
                    or (
                        repeating_measures_prev_line['amount'] !=
                        repeating_measures_prev_line['line'].measures.count()
                    )
                ):
                    return False

            return True

        def get_match():
            """
            Returns a match or `False` if no match is found.
            """

            match = False

            for line in self.section.lines.filter(
                letter=self.letter,
                number__lt=self.number
            ):

                if (
                    line.subsection_line_number != self.subsection_line_number
                    or line.subsection_number == self.subsection_number
                ):
                    # The `subsection_line_number` should match, and we
                    # can't repeat lines from the same subsection.
                    continue

                equal_count = get_equal_count(line)

                if equal_count >= 4:
                    match = make_match(line, equal_count)
                    break

            return match

        def get_equal_count(line):
            """
            Returns the amount of measures starting from measure 1, that
            are equal in the given `line` and the current line (`self`).
            """

            equal_count = 0

            for line_measure, this_line_measure in (
                zip(line.measures.all(), self.measures.all())
            ):
                if line_measure.equal_to(this_line_measure):
                    equal_count += 1
                else:
                    break

            return equal_count

        def make_match(line, equal_count):
            """
            Makes and returns a match dict for the given `line` and
            `equal_count`.
            """

            match = {
                'line': line,
                'amount': equal_count,
            }

            if context_info:
                match.update(get_context_info(match))

            return match

        def get_context_info(match):
            """
            Returns a dict with context info about the match.
            """

            span_next_line = False
            span_prev_line = False

            if (
                match['amount'] == match['line'].measures.count()
                and self.merge_with_next_line
                and self.next_line.repeating_measures(context_info=False)
            ):
                span_next_line = True

            if self.prev_line and self.merge_with_prev_line:

                prev_line_repeating_measures = (
                    self.prev_line.repeating_measures(context_info=False)
                )

                if (
                    prev_line_repeating_measures
                    and (
                        prev_line_repeating_measures['amount'] ==
                        prev_line_repeating_measures['line'].measures.count()
                    )
                ):
                    span_prev_line = True

            return {
                'span_next_line': span_next_line,
                'span_prev_line': span_prev_line
            }

        if not (self.section.show_sidebar and prev_line_valid()):
            return False
        else:
            return get_match()

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
        default=1,
        help_text=(
            """The number for the measure. Will be used to determine the order
            of the measures."""
        )
    )

    beat_schema = models.CharField(
        default='4',
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

    @property
    def key(self):
        """
        The key the measure is in.

        This will be the same as the key of the line the measure is in.
        """
        return self.line.key

    @property
    def time_signature(self):
        return self.line.time_signature

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
                number__lt=self.number
            ).reverse()[0]
        except IndexError:
            return None

    def equal_to(self, measure):
        """
        Returns a boolean indicating if the given `measure` is equal to
        this measure.
        """

        if measure.beat_schema == self.beat_schema:

            is_equal = True

            for chord1, chord2 in zip(measure.chords.all(), self.chords.all()):
                if not chord1.equal_to(chord2):
                    is_equal = False

        else:
            is_equal = False

        return is_equal

    def cleanup(self):
        """
        Removes chords that don't fit in the `beat_schema` of this
        measure.
        """
        self.chords.filter(number__gt=self.chords_count()).delete()
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
        default=0,
        help_text=(
            """The relative pitch for the chord. This is the amount of half
            notes the chord note is away from the root of the key of the
            section. These half steps should be upwards in the scale."""
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

    rest = models.BooleanField(
        default=False,
        help_text="If on, this chord is interpreted as a rest"
    )

    number = models.PositiveSmallIntegerField(
        default=1,
        help_text=(
            """The number for the chord. Will be used to determine the order of
            the chords."""
        )
    )

    def __str__(self):
        return self.chord_notation

    class Meta:
        ordering = ('number',)
        unique_together = ('measure', 'number')

    def client_data(self):
        return {
            'id': self.id,
            'beats': self.beats,
            'chord_pitch': self.chord_pitch,
            'alt_bass': self.alt_bass,
            'alt_bass_pitch': self.alt_bass_pitch,
            'rest': self.rest,
            'number': self.number,
            'key_id': self.key.id,
            'note': self.note.client_data(),
            'chord_type_id': self.chord_type.id,
            'alt_bass_note': (
                self.alt_bass_note.client_data()
                if self.alt_bass else False
            ),
            'chart_output': self.chart_output,
            'chart_fontsize': self.chart_fontsize
        }

    @property
    def chord_notation(self):
        """
        The notation for the chord.

        This is a build up with these components:
        - The chord note, this includes any flats or sharps too.
        - The symbol of the chord type.
        - Possibly the alternative bass note.
        """

        chord_notation = '{}{}'.format(
            self.note.name,
            self.chord_type.chord_output
        )

        if self.alt_bass:
            chord_notation += '/{}'.format(self.alt_bass_note.name)

        return chord_notation

    @property
    def chart_output(self):
        """
        The way the chord will be displayed on the chart. This can either be
        the original chord notation or the repeat sign.
        """

        if self.rest:
            return 'REST'

        time_signature_beats = self.time_signature.beats

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
                        self.alt_bass_pitch == prev_chord.alt_bass_pitch
                    )
                )
            ):
                return '%'

        return self.chord_notation

    @property
    def chart_fontsize(self):
        """
        Returns a either 'tiny', 'small' or 'normal' to relatively
        indicate what the font size on the chart should be.
        """
        if self.rest:
            return 'tiny'
        else:
            return 'normal'

    @property
    def key(self):
        """
        The key the chord is in.

        This will be the same as the key of the measure the chord is in.
        """
        return self.measure.key

    @property
    def time_signature(self):
        return self.measure.time_signature

    @property
    def note(self):
        """
        The note for the chord.
        """
        return self.key.note(self.chord_pitch)

    @property
    def alt_bass_note(self):
        """
        The alternative bass note for this chord.

        If there is no alternative bass note, it will return `False`.
        """

        if self.alt_bass:
            return self.key.note(self.alt_bass_pitch)
        else:
            return False

    def equal_to(self, chord):
        """
        Returns a boolean indicating if the given `chord` is equal to
        this chord.
        """
        if (
            (self.rest and chord.rest)
            or self.chord_notation == chord.chord_notation
        ):
            return True
        else:
            return False
