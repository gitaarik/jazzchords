# encoding: utf8
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0007_line_merge_with_next_line'),
    ]

    operations = [
        migrations.RenameField(
            model_name='line',
            old_name='merge_with_next_line',
            new_name='_merge_with_next_line',
        ),
    ]
