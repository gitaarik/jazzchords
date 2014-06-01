# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0013_auto_20140530_0834'),
    ]

    operations = [
        migrations.AddField(
            model_name='chord',
            name='number',
            field=models.PositiveSmallIntegerField(default=1, help_text='The number for the chord. Will be used to determine the order of\n            the chords.'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='line',
            name='number',
            field=models.PositiveSmallIntegerField(default=1, help_text='The number for the line. Will be used to determine the order of\n            the lines.'),
        ),
        migrations.AlterField(
            model_name='measure',
            name='number',
            field=models.PositiveSmallIntegerField(default=1, help_text='The number for the measure. Will be used to determine the order\n            of the measures.'),
        ),
        migrations.AlterField(
            model_name='section',
            name='number',
            field=models.PositiveSmallIntegerField(default=1, help_text='The section number. Will be used to put the sections in order'),
        ),
        migrations.AlterField(
            model_name='chord',
            name='chord_pitch',
            field=models.PositiveSmallIntegerField(default=0, help_text='The relative pitch for the chord. This is the amount of half\n            notes the chord note is away from the root of the key the item will\n            be presented in. These half steps should be upwards in the\n            scale.'),
        ),
    ]
