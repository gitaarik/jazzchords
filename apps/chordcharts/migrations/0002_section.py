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
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('chart', models.ForeignKey(to_field='id', to='chordcharts.Chart', help_text='The chart this section is in.')),
                ('key_distance_from_chart', models.PositiveSmallIntegerField(default=0, help_text='The distance (in half notes) the key of this section is\n        relative to the key of the chart. If the section is in the same key\n        this will be 0.')),
                ('number', models.PositiveSmallIntegerField(help_text='The section number. Will be used to put the sections in order')),
                ('alt_name', models.CharField(max_length=25, help_text='\n        Alternative title for the section. Normally a section get\'s assigned a\n        letter (starting with A, next B etc.) which is displayed left of the\n        section\'s boxed chart. If you fill in this "alternative title" this\n        title will be shown on top of the section\'s boxed chart. This is\n        appropriate for an intro, outro or maybe a bridge which isn\'t a\n        regularry repeating section in the song.', blank=True)),
                ('time_signature', models.ForeignKey(to_field='id', to='chordcharts.TimeSignature')),
            ],
            options={
                'ordering': ('number',),
            },
            bases=(models.Model,),
        ),
    ]
