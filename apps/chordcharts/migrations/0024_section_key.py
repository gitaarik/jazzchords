# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0023_auto_20140627_0324'),
    ]

    operations = [
        migrations.AddField(
            model_name='section',
            name='key',
            field=models.ForeignKey(to_field='id', null=True, help_text='The key the chart is in. If the some sections of the song have\n            deviating keys you can overwrite this in the section.', to='chordcharts.Key'),
            preserve_default=True,
        ),
    ]
