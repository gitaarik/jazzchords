# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0003_subsection'),
    ]

    operations = [
        migrations.CreateModel(
            name='Line',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('subsection', models.ForeignKey(to_field='id', to='chordcharts.Subsection', help_text='The subsection this line belongs to.')),
                ('number', models.PositiveSmallIntegerField(help_text='The number for\n        the line. Will be used to determine the order of the lines.')),
            ],
            options={
                'ordering': ('number',),
            },
            bases=(models.Model,),
        ),
    ]
