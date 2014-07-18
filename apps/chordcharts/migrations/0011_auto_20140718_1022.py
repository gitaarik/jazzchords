# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0010_auto_20140718_1020'),
    ]

    operations = [
        migrations.AlterField(
            model_name='section',
            name='title',
            field=models.CharField(max_length=25, blank=True, help_text='Title for the section. If set, will be displayed above the\n            section.'),
        ),
    ]
