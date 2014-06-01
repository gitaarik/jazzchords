# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0014_auto_20140531_0618'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='chord',
            unique_together=set([('measure', 'number')]),
        ),
    ]
