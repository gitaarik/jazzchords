# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0015_chart_owner'),
    ]

    operations = [
        migrations.AddField(
            model_name='chart',
            name='creation_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=True,
        ),
    ]
