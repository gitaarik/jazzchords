# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0008_auto_20140520_0159'),
    ]

    operations = [
        migrations.AddField(
            model_name='line',
            name='section',
            field=models.ForeignKey(to_field='id', to='chordcharts.Section', default=1, help_text='The section this line belongs to.'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='line',
            name='letter',
            field=models.CharField(choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('E', 'E'), ('F', 'F')], max_length=1, help_text='The letter the line has. This will show up in the sidebar of the\n            section', default='A'),
        ),
    ]
