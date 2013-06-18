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

    name = models.CharField(max_length=25)

    def tone(self, distance_from_root, accidental=0):
        return self.pitch_set.get(distance_from_root=distance_from_root).name

    def resolve_accidentals(self, pitch, accidental):
        return (pitch, accidental)

    def __unicode__(self):
        return self.name


class Pitch(models.Model):

    name = models.CharField(max_length=2)
    key = models.ForeignKey(Key)
    distance_from_root = models.PositiveSmallIntegerField()
    key_tone = models.BooleanField()

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
    alternative_bass_tone = models.PositiveSmallIntegerField(default=0,
        help_text='If the chord has an alternative tone in the bass, specify '
        'this tone here. Otherwise, leave blank')

    def __unicode__(self):
        return self.chord_name()

    class Meta:
        ordering = ('position',)
        unique_together = ('chart_section', 'position')

    def chord_name(self):

        if self.alternative_bass_tone:
            alt_base = '/{}'.format(
                self.chart_section.key.tone(self.alternative_bass_tone))
        else:
            alt_base = ''

        return u''.join([
            self.chart_section.key.tone(self.chord_pitch),
            self.chord_type.symbol,
            alt_base])
