# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0017_chart_public'),
    ]

    operations = [
        migrations.AddField(
            model_name='chord',
            name='chord_note_alt_notation',
            field=models.BooleanField(help_text='Indicates whether the alternative notation for the tone in the\n            Key should be used. For example, In C Major, the C# can\n            alternatively be written as D♭.', default=False),
        ),
        migrations.AlterField(
            model_name='note',
            name='name',
            field=models.CharField(max_length=2, help_text='The name for the note. Should be a letter from A to G and\n            possibly a flat (♭) or sharp (#) sign.'),
        ),
    ]
