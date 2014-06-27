# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0021_auto_20140603_0144'),
    ]

    operations = [
        migrations.AlterField(
            model_name='key',
            name='tone',
            field=models.CharField(default='C', help_text='The tonic for the key. Will be used for displaying the possible\n            keys for a certain tonality.', max_length=2, choices=[('C', 'C'), ('C#', 'C#'), ('D', 'D'), ('E♭', 'E♭'), ('E', 'E'), ('F', 'F'), ('F#', 'F#'), ('G', 'G'), ('A♭', 'A♭'), ('A', 'A'), ('B♭', 'B♭'), ('B', 'B')]),
        ),
    ]
