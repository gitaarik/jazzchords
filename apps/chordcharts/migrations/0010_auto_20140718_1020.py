# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0009_auto_20140716_1057'),
    ]

    operations = [
        migrations.RenameField(
            model_name='section',
            old_name='alt_name',
            new_name='title',
        ),
    ]
