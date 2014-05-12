# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0005_measure'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chord',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('measure', models.ForeignKey(to_field='id', to='chordcharts.Measure', help_text='The measure this chord belongs to.')),
                ('beats', models.PositiveSmallIntegerField(default=4, help_text='\n        The number of beats the item should be played. The current chord chart\n        representations only support 4/4 measures.')),
                ('chord_pitch', models.PositiveSmallIntegerField(help_text='The relative pitch for the chord. This is the amount of half notes\n        the chord note is away from the root of the key the item will be\n        presented in. These half steps should be upwards in the scale.')),
                ('chord_type', models.ForeignKey(to_field='id', to='chordcharts.ChordType', help_text='The type of the\n        chord. This defines the intervals inside the chord.')),
                ('alt_bass', models.BooleanField(default=False, help_text='Indicates if the\n        chord has an alternative tone in the bass.')),
                ('alt_bass_pitch', models.PositiveSmallIntegerField(default=0, help_text='The alternative bass tone in the chord. As with the Chord\n        Pitch, it is the amount of half notes the chord note is away from the\n        root of the key the item will be presented in. These half steps should\n        be upwards in the scale. It will only be used if `Use Alternative Bass`\n        is set.')),
                ('order', models.PositiveSmallIntegerField(help_text='The order for\n        the chord. Will be used to determine the order of the chords.')),
            ],
            options={
                'unique_together': set([('measure', 'order')]),
                'ordering': ('order',),
            },
            bases=(models.Model,),
        ),
    ]
