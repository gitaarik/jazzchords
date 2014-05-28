# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0011_auto_20140528_0938'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chart',
            name='lyrics_url',
            field=models.CharField(max_length=500, default=''),
        ),
        migrations.AlterField(
            model_name='chart',
            name='short_description',
            field=models.CharField(max_length=75, default=''),
        ),
        migrations.AlterField(
            model_name='chart',
            name='video_url',
            field=models.CharField(max_length=500, default=''),
        ),
    ]
