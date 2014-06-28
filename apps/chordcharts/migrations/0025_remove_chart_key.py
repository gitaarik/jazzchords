# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0024_section_key'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chart',
            name='key',
        ),
    ]
