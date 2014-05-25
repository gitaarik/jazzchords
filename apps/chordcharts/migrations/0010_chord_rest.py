# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0009_auto_20140520_1516'),
    ]

    operations = [
        migrations.AddField(
            model_name='chord',
            name='rest',
            field=models.BooleanField(default=False, help_text='If on, this chord is interpreted as a rest'),
            preserve_default=True,
        ),
    ]
