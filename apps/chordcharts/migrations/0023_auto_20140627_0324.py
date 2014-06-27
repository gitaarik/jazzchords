# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0022_auto_20140627_0324'),
    ]

    operations = [
        migrations.RenameField(
            model_name='key',
            old_name='tone',
            new_name='tonic'
        )
    ]
