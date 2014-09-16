# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0011_auto_20140718_1022'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chart',
            name='song',
            field=models.ForeignKey(related_name='charts', to='songs.Song'),
        ),
        migrations.AlterField(
            model_name='chord',
            name='measure',
            field=models.ForeignKey(related_name='chords', help_text='The measure this chord belongs to.', to='chordcharts.Measure'),
        ),
        migrations.AlterField(
            model_name='line',
            name='section',
            field=models.ForeignKey(related_name='lines', help_text='The section this line belongs to.', to='chordcharts.Section'),
        ),
        migrations.AlterField(
            model_name='measure',
            name='line',
            field=models.ForeignKey(related_name='measures', help_text='The line this measure belongs to.', to='chordcharts.Line'),
        ),
        migrations.AlterField(
            model_name='note',
            name='key',
            field=models.ForeignKey(related_name='notes', help_text="The key this note belongs to. Doesn't necessarily have to be a\n            note IN the key. We also specify out-of-key notes so the system\n            won't have to guess how to represend them.", to='chordcharts.Key'),
        ),
        migrations.AlterField(
            model_name='section',
            name='chart',
            field=models.ForeignKey(related_name='sections', help_text='The chart this section is in.', to='chordcharts.Chart'),
        ),
    ]
