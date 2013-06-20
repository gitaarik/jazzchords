# coding=utf8
from django.db import models
from django.core.exceptions import ObjectDoesNotExist

from songs.models import Song
from .chartsections.boxed import BoxedChart, BoxedChartSection
from .exceptions import SectionKeyDoesNotExist


class Key(models.Model):

    TONALITY_MAJOR = 1
    TONALITY_MINOR = 1
    TONALITY_CHOICES = (
        (TONALITY_MAJOR, 'Major'),
        (TONALITY_MINOR, 'Minor')
    )

    name = models.CharField(max_length=25)
    tonality = models.PositiveSmallIntegerField(choices=TONALITY_CHOICES)
    distance_from_c = models.PositiveSmallIntegerField()

    def __unicode__(self):
        return self.name

    def tone(self, distance_from_root, accidental=0):
        return self.pitch_set.get(distance_from_root=distance_from_root).name


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


class Chart(models.Model):

    song = models.ForeignKey(Song)
    key = models.ForeignKey(Key, help_text='''The key the chart is in. If the
        some sections of the song have deviating keys you can overwrite this in
        the section.''')

    def __unicode__(self):
        return unicode(self.song)

    def boxed_chart(self):
        return BoxedChart(self)


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
    key_distance_from_chart = models.PositiveSmallIntegerField(default=0,
        help_text='''If this section is in a different key than the default key
        for the chart, you can specify the distance from the chart key here''')
    line_width = models.PositiveSmallIntegerField(default=8)
    position = models.PositiveSmallIntegerField()

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ('position',)
        unique_together = ('chart', 'position')

    def key(self):

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
        return BoxedChartSection(self)


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

        try:
            section_key = self.chart_section.key()
        except SectionKeyDoesNotExist:
            note = u'�'
            alt_base = ''
        else:

            note = section_key.tone(self.chord_pitch)

            if self.alternative_bass_tone:
                alt_base = u'/{}'.format(
                    section_key.tone(self.alternative_bass_tone))
            else:
                alt_base = ''


        return u''.join([
            note,
            self.chord_type.symbol,
            alt_base])
