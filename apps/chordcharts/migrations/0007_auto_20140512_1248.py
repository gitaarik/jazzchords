# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0006_chord'),
    ]

    operations = [
        migrations.AddField(
            model_name='subsection',
            name='letter',
            field=models.CharField(max_length=1, default='A', help_text='The letter of the subsection.\n        This is used in the sidebar if the section of this subsection has\n        `use_subsections` to `True`.', choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='section',
            name='use_subsections',
            field=models.BooleanField(default=False, help_text="A boolean\n        indicating if subsections should be used. If subsections are used,\n        sections can have multiple subsections that have a letter in the\n        sidebar. If subsections aren't used, the sections is assumed to have\n        just one subsection and no letter is used in the sidebar."),
            preserve_default=True,
        ),
    ]
