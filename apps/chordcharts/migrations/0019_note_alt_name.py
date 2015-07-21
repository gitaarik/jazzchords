# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0018_auto_20150721_1155'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='alt_name',
            field=models.CharField(max_length=2, default='', help_text='The alternative name for the note. Should be a letter from A to\n            G and possibly a flat (♭) or sharp (#) sign.'),
            preserve_default=False,
        ),
    ]
