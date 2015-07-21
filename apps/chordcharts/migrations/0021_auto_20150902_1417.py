# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0020_auto_20150803_1051'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chord',
            name='alt_bass_note_alt_notation',
        ),
        migrations.RemoveField(
            model_name='chord',
            name='chord_note_alt_notation',
        ),
        migrations.AddField(
            model_name='chord',
            name='_alt_bass_note_alt_notation',
            field=models.BooleanField(default=False, db_column='alt_bass_note_alt_notation', help_text='Indicates whether the alternative notation for the note in the\n            Key should be used for the alt bass note. For example, In C Major,\n            the C# can alternatively be written as D♭.'),
        ),
        migrations.AddField(
            model_name='chord',
            name='_chord_note_alt_notation',
            field=models.BooleanField(default=False, db_column='chord_note_alt_notation', help_text='Indicates whether the alternative notation for the note in the\n            Key should be used. For example, In C Major, the C# can\n            alternatively be written as D♭.'),
        ),
    ]
