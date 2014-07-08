# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0006_auto_20140630_1214'),
    ]

    operations = [
        migrations.AddField(
            model_name='line',
            name='merge_with_next_line',
            field=models.BooleanField(default=True, help_text="If this is checked and the next line has the same letter as this\n            line, then the two lines will be represented as one subsection. If\n            it's not checked, they will be both repretitions of the same\n            subsection."),
            preserve_default=True,
        ),
    ]
