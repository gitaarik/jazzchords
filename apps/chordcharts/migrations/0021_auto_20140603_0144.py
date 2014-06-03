# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0020_auto_20140531_0836'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chart',
            name='video_url',
            field=models.CharField(max_length=500, default='', blank=True),
        ),
        migrations.AlterField(
            model_name='chart',
            name='short_description',
            field=models.CharField(max_length=150, default='', blank=True),
        ),
        migrations.AlterField(
            model_name='chart',
            name='lyrics_url',
            field=models.CharField(max_length=500, default='', blank=True),
        ),
    ]
