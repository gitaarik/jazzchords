# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0016_chart_creation_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='chart',
            name='public',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
