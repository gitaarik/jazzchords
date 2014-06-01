# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0015_auto_20140531_0641'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='chord',
            unique_together=set([]),
        ),
    ]
