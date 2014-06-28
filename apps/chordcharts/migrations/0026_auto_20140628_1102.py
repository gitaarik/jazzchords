# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0025_remove_chart_key'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='section',
            name='key_distance_from_chart',
        ),
        migrations.AlterField(
            model_name='chord',
            name='chord_pitch',
            field=models.PositiveSmallIntegerField(help_text='The relative pitch for the chord. This is the amount of half\n            notes the chord note is away from the root of the key of the\n            section. These half steps should be upwards in the scale.', default=0),
        ),
    ]
