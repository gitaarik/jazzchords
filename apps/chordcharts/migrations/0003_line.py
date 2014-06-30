# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0002_section'),
    ]

    operations = [
        migrations.CreateModel(
            name='Line',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('section', models.ForeignKey(help_text='The section this line belongs to.', to_field='id', to='chordcharts.Section')),
                ('number', models.PositiveSmallIntegerField(help_text='The number for the line. Will be used to determine the order of\n            the lines.', default=1)),
                ('letter', models.CharField(help_text='The letter the line has. This will show up in the sidebar of the\n            section', default='A', max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('E', 'E'), ('F', 'F')])),
            ],
            options={
                'ordering': ('number',),
            },
            bases=(models.Model,),
        ),
    ]
