# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0013_auto_20141001_1334'),
    ]

    operations = [
        migrations.AlterField(
            model_name='section',
            name='name',
            field=models.CharField(max_length=25, help_text='Name for the section. If set, will be displayed above the\n            section.', blank=True),
        ),
    ]
