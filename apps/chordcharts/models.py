from django.db import models

from songs.models import Song
from .chartsections.boxed import BoxedChartSection


class Chart(models.Model):

    song = models.ForeignKey(Song)

    def __unicode__(self):
        return unicode(self.song)

    def boxed_chart_width(self):

        width = 0

        for section in self.section_set.all():
            section_width = section.boxed_chart().width
            if section_width > width:
                width = section_width

        return width


class Key(models.Model):

    TONALITY_MAJOR = 1
    TONALITY_MINOR = 2
    TONALITY_CHOICES = (
        (TONALITY_MAJOR, 'Major'),
        (TONALITY_MINOR, 'Minor'),
    )

    name = models.CharField(max_length=25)
    symbol = models.CharField(max_length=5)
    tonality = models.PositiveSmallIntegerField(choices=TONALITY_CHOICES)
    distance_from_c = models.PositiveSmallIntegerField()

    def __unicode__(self):
        return self.name


class Pitch(models.Model):

    name = models.CharField(max_length=1)
    key = models.ForeignKey(Key)
    distance_from_root = models.PositiveSmallIntegerField()
    accidental = models.SmallIntegerField(default=0, help_text=
        '0 is neutral, -1 if flat, 1 is sharp, -2 is double flat, 2 is double '
        'sharp, and so on.')

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Pitches'
        ordering = ('distance_from_root',)


class Section(models.Model):

    KEY_C = 1
    KEY_D_FLAT = 2
    KEY_D = 3
    KEY_E_FLAT = 4
    KEY_E = 5
    KEY_F = 6
    KEY_F_SHARP = 7
    KEY_G_FLAT = 8
    KEY_G = 9
    KEY_A_FLAT = 10
    KEY_A = 11
    KEY_B_FLAT = 12
    KEY_B = 13

    KEY_CHOICES = (
        (KEY_C, 'C'),
        (KEY_D_FLAT, 'Db'),
        (KEY_D, 'D'),
        (KEY_E_FLAT, 'Eb'),
        (KEY_E, 'E'),
        (KEY_F, 'F'),
        (KEY_F_SHARP, 'F#'),
        (KEY_G_FLAT, 'Gb'),
        (KEY_G, 'G'),
        (KEY_A_FLAT, 'Ab'),
        (KEY_A, 'A'),
        (KEY_B_FLAT, 'Bb'),
        (KEY_B, 'B'),
    )

    TONALITY_MAJOR = 1
    TONALITY_MINOR = 2
    TONALITY_CHOICES = (
        (TONALITY_MAJOR, 'Major'),
        (TONALITY_MINOR, 'Minor'),
    )

    name = models.CharField(max_length=10)
    chart = models.ForeignKey(Chart)
    key = models.ForeignKey(Key)
    line_width = models.PositiveSmallIntegerField(default=8)
    position = models.PositiveSmallIntegerField()

    _boxed_chart = None

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ('position',)
        unique_together = ('chart', 'position')

    def boxed_chart(self):
        if not self._boxed_chart:
            self._boxed_chart = BoxedChartSection(self)
        return self._boxed_chart


class ChordType(models.Model):

    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=10, blank=True)

    def __unicode__(self):
        return self.symbol

    class Meta:
        ordering = ('name',)


class Item(models.Model):

    chart_section = models.ForeignKey(Section)
    position = models.PositiveSmallIntegerField()
    beats = models.PositiveSmallIntegerField(default=4)
    chord_type = models.ForeignKey(ChordType)
    chord_pitch = models.PositiveSmallIntegerField()
    chord_accidental = models.SmallIntegerField(default=0, help_text=
        '0 is neutral, -1 if flat, 1 is sharp, -2 is double flat, 2 is double '
        'sharp, and so on.')
    alternative_bass_tone = models.PositiveSmallIntegerField(default=0,
        help_text='If the chord has an alternative tone in the bass, specify '
        'this tone here. Otherwise, leave blank')

    def __unicode__(self):
        return self.chord_name()

    class Meta:
        ordering = ('position',)
        unique_together = ('chart_section', 'position')

    def chord_name(self):

        if self.chord_accidental:
            if self.chord_accidental > 0:
                accidental = '#' * (1 * self.chord_accidental)
            else:
                accidental = 'b' * (-1 * self.chord_accidental)
        else:
            accidental = ''

        return u'{}{}{}'.format(
            self.chord_key_pitch().name,
            accidental,
            self.chord_type.symbol)

    def chord_key_pitch(self):
        return self.chart_section.key.pitch_set.get(
            distance_from_root=self.chord_pitch)
