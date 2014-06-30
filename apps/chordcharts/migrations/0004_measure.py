# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0003_line'),
    ]

    operations = [
        migrations.CreateModel(
            name='Measure',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('line', models.ForeignKey(help_text='The line this measure belongs to.', to_field='id', to='chordcharts.Line')),
                ('number', models.PositiveSmallIntegerField(help_text='The number for the measure. Will be used to determine the order\n            of the measures.', default=1)),
                ('beat_schema', models.CharField(help_text='The type of beatschema for this measure. This is related to the\n            chords that are in the measure. If the measure has one chord that\n            is played for 4 beats, the beatschema is "4", if the measure has\n            two chords that are both played for 2 beats, the beatschema is\n            "2-2", if the measure has three chords where the first one is\n            played 2 beats and the other two one 1 beat, the beatschema is\n            "2-1-1" etc.', default='4', max_length=13)),
            ],
            options={
                'ordering': ('number',),
            },
            bases=(models.Model,),
        ),
    ]
