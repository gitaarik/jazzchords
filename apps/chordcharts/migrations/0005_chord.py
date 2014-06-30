# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0004_measure'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chord',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('measure', models.ForeignKey(help_text='The measure this chord belongs to.', to_field='id', to='chordcharts.Measure')),
                ('beats', models.PositiveSmallIntegerField(help_text='The number of beats the item should be played. The current chord\n            chart representations only support 4/4 measures.', default=4)),
                ('chord_pitch', models.PositiveSmallIntegerField(help_text='The relative pitch for the chord. This is the amount of half\n            notes the chord note is away from the root of the key of the\n            section. These half steps should be upwards in the scale.', default=0)),
                ('chord_type', models.ForeignKey(help_text='The type of the chord. This defines the intervals inside the\n            chord.', to_field='id', to='chordcharts.ChordType')),
                ('alt_bass', models.BooleanField(help_text='Indicates if the chord has an alternative tone in the bass.', default=False)),
                ('alt_bass_pitch', models.PositiveSmallIntegerField(help_text='The alternative bass tone in the chord. As with the Chord Pitch,\n            it is the amount of half notes the chord note is away from the root\n            of the key the item will be presented in. These half steps should\n            be upwards in the scale. It will only be used if `Use Alternative\n            Bass` is set.', default=0)),
                ('rest', models.BooleanField(help_text='If on, this chord is interpreted as a rest', default=False)),
                ('number', models.PositiveSmallIntegerField(help_text='The number for the chord. Will be used to determine the order of\n            the chords.', default=1)),
            ],
            options={
                'ordering': ('number',),
                'unique_together': set([('measure', 'number')]),
            },
            bases=(models.Model,),
        ),
    ]
