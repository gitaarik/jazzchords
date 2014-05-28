# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0010_chord_rest'),
    ]

    operations = [
        migrations.AddField(
            model_name='chart',
            name='short_description',
            field=models.CharField(max_length=75, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='chart',
            name='video_url',
            field=models.CharField(null=True, max_length=500),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='chart',
            name='lyrics_url',
            field=models.CharField(null=True, max_length=500),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='chart',
            name='song',
            field=models.ForeignKey(to_field='id', to='songs.Song'),
        ),
    ]
