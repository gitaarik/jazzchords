# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0002_section'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subsection',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('section', models.ForeignKey(to_field='id', to='chordcharts.Section', help_text='The section this subsection belongs to.')),
                ('number', models.PositiveSmallIntegerField(help_text='The number\n        for the subsection. Will be used to determine the order of the\n        subsections.')),
            ],
            options={
                'ordering': ('number',),
            },
            bases=(models.Model,),
        ),
    ]
