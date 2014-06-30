# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('songs', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='TimeSignature',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('beats', models.PositiveSmallIntegerField()),
                ('beat_unit', models.PositiveSmallIntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ChordType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(help_text='The human understandable name that descripes the chord type. For\n            example: Major, Major Seven, Ninth, Diminished etc.', max_length=50)),
                ('symbol', models.CharField(help_text='The symbol for the chord type. For example: m (for Major), m\n            (for Minor), 7 (for Seventh). This will be used for choosing a\n            chord type in the edit widget.', max_length=10)),
                ('chord_output', models.CharField(help_text='The way the symbol will be displayed when used in a chord.\n            Usually this is the same as the normal symbol, but for some chords\n            it might be different. For example, a Major chord is usually\n            written without a symbol. This will be used for the chord\n            representation in the chart.\n            ', max_length=10, blank=True)),
                ('order', models.PositiveSmallIntegerField(help_text='The order in which the chord types will appear. This is used in\n            the edit widget. More used chords should appear before lesser used\n            chords.')),
            ],
            options={
                'ordering': ('order',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Key',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(help_text='Appropriate name for this key.', max_length=25)),
                ('slug', models.SlugField(help_text="Lowercase name for the key with dashes instead of spaces. Will\n            be used in URL's.", unique=True, max_length=25)),
                ('tonic', models.CharField(help_text='The tonic for the key. Will be used for displaying the possible\n            keys for a certain tonality.', default='C', max_length=2, choices=[('C', 'C'), ('C#', 'C#'), ('D', 'D'), ('E♭', 'E♭'), ('E', 'E'), ('F', 'F'), ('F#', 'F#'), ('G', 'G'), ('A♭', 'A♭'), ('A', 'A'), ('B♭', 'B♭'), ('B', 'B')])),
                ('tonality', models.PositiveSmallIntegerField(help_text='The tonality for this key. Will be used for finding the right\n            key when transposing, because we want to transpose to the same\n            tonality.', choices=[(1, 'Major'), (2, 'Minor')])),
                ('distance_from_c', models.PositiveSmallIntegerField(help_text='The distance the root note from this key has from the C note.\n            This should be expressed in the amount of half notes to go up to\n            reach the C. If the root not is C this will be 0. It will be used\n            for finding the right key when transposing.')),
                ('order', models.PositiveSmallIntegerField(help_text='The order the keys of a certain tonality should appear in.')),
            ],
            options={
                'ordering': ('order',),
                'unique_together': set([('tonality', 'order')]),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Chart',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('song', models.ForeignKey(to='songs.Song', to_field='id')),
                ('short_description', models.CharField(default='', max_length=150, blank=True)),
                ('video_url', models.CharField(default='', max_length=500, blank=True)),
                ('lyrics_url', models.CharField(default='', max_length=500, blank=True)),
            ],
            options={
                'ordering': ['song__name'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('key', models.ForeignKey(help_text="The key this note belongs to. Doesn't necessarily have to be a\n            note IN the key. We also specify out-of-key notes so the system\n            won't have to guess how to represend them.", to_field='id', to='chordcharts.Key')),
                ('name', models.CharField(help_text='The name for the note. Should be a letter from A to G and\n            possibly a flat (b) or sharp (#) sign.', max_length=2)),
                ('distance_from_root', models.PositiveSmallIntegerField(help_text='The distance this note has from the root note of the associated\n            key. If this IS the root note, the distance is 0.')),
                ('key_note', models.BooleanField(help_text="Indicates if this note is a note that really is IN the key. We\n            also specify out-of-key notes so the system won't have to guess how\n            to represend them.", default=False)),
            ],
            options={
                'ordering': ('distance_from_root',),
            },
            bases=(models.Model,),
        ),
    ]
