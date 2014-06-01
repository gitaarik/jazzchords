# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0017_auto_20140531_0756'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chord',
            name='order',
        ),
    ]
