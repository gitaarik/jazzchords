# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0004_line'),
    ]

    operations = [
        migrations.CreateModel(
            name='Measure',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('line', models.ForeignKey(to_field='id', to='chordcharts.Line', help_text='The line this measure belongs to.')),
                ('number', models.PositiveSmallIntegerField(help_text='The number for\n        the measure. Will be used to determine the order of the measures.')),
                ('beat_schema', models.CharField(max_length=13, help_text='The type of\n        beatschema for this measure. This is related to the chords that are in\n        the measure. If the measure has one chord that is played for 4 beats,\n        the beatschema is "4", if the measure has two chords that are both\n        played for 2 beats, the beatschema is "2-2", if the measure has three\n        chords where the first one is played 2 beats and the other two one 1\n        beat, the beatschema is "2-1-1" etc.')),
            ],
            options={
                'ordering': ('number',),
            },
            bases=(models.Model,),
        ),
    ]
