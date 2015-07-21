# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0019_note_alt_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='chord',
            name='alt_bass_note_alt_notation',
            field=models.BooleanField(default=False, help_text='Indicates whether the alternative notation for the note in the\n            Key should be used for the alt bass note. For example, In C Major,\n            the C# can alternatively be written as D♭.'),
        ),
        migrations.AlterField(
            model_name='chord',
            name='chord_note_alt_notation',
            field=models.BooleanField(default=False, help_text='Indicates whether the alternative notation for the note in the\n            Key should be used. For example, In C Major, the C# can\n            alternatively be written as D♭.'),
        ),
        migrations.AlterField(
            model_name='note',
            name='alt_name',
            field=models.CharField(max_length=2, blank=True, help_text='The alternative name for the note. Should be a letter from A to\n            G and possibly a flat (♭) or sharp (#) sign.'),
        ),
    ]
