# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0012_auto_20140915_1237'),
    ]

    operations = [
        migrations.RenameField(
            model_name='section',
            old_name='title',
            new_name='name',
        ),
    ]
