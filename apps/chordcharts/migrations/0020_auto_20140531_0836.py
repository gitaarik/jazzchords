# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0019_auto_20140531_0800'),
    ]

    operations = [
        migrations.AlterField(
            model_name='measure',
            name='beat_schema',
            field=models.CharField(max_length=13, default='4', help_text='The type of beatschema for this measure. This is related to the\n            chords that are in the measure. If the measure has one chord that\n            is played for 4 beats, the beatschema is "4", if the measure has\n            two chords that are both played for 2 beats, the beatschema is\n            "2-2", if the measure has three chords where the first one is\n            played 2 beats and the other two one 1 beat, the beatschema is\n            "2-1-1" etc.'),
        ),
    ]
