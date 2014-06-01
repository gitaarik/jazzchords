# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0012_auto_20140528_0939'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chart',
            name='short_description',
            field=models.CharField(default='', max_length=150),
        ),
    ]
