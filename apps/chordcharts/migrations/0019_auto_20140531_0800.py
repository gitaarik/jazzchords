# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0018_remove_chord_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chord',
            name='number',
            field=models.PositiveSmallIntegerField(default=1, help_text='The number for the chord. Will be used to determine the order of\n            the chords.'),
        ),
    ]
