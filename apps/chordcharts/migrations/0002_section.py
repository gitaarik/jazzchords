# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('chart', models.ForeignKey(help_text='The chart this section is in.', to_field='id', to='chordcharts.Chart')),
                ('key', models.ForeignKey(help_text='The key the chart is in. If the some sections of the song have\n            deviating keys you can overwrite this in the section.', to_field='id', null=True, to='chordcharts.Key')),
                ('number', models.PositiveSmallIntegerField(help_text='The section number. Will be used to put the sections in order', default=1)),
                ('alt_name', models.CharField(help_text='Alternative title for the section. Normally a section\n        get\'s assigned a letter (starting with A, next B etc.) which is\n        displayed left of the section\'s boxed chart. If you fill in this\n        "alternative title" this title will be shown on top of the section\'s\n        boxed chart. This is appropriate for an intro, outro or maybe a bridge\n        which isn\'t a regularry repeating section in the song.', max_length=25, blank=True)),
                ('time_signature', models.ForeignKey(to='chordcharts.TimeSignature', to_field='id')),
                ('show_sidebar', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ('number',),
            },
            bases=(models.Model,),
        ),
    ]
