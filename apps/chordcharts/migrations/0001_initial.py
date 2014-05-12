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
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
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
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('name', models.CharField(max_length=50, help_text='The human understandable name that descripes the chord type. For\n        example: Major, Major Seven, Ninth, Diminished etc.')),
                ('symbol', models.CharField(max_length=10, help_text='The symbol for the\n        chord type. For example: m (for Major), m (for Minor), 7 (for Seventh).\n        This will be used for choosing a chord type in the edit widget.')),
                ('chord_output', models.CharField(max_length=10, help_text='The way the symbol will be displayed when used in a chord. Usually\n        this is the same as the normal symbol, but for some chords it might be\n        different. For example, a Major chord is usually written without a\n        symbol. This will be used for the chord representation in the chart.\n        ', blank=True)),
                ('order', models.PositiveSmallIntegerField(help_text='The order in which\n        the chord types will appear. This is used in the edit widget. More used\n        chords should appear before lesser used chords.')),
            ],
            options={
                'ordering': ('order',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Key',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('name', models.CharField(max_length=25, help_text='Appropriate name for this key.')),
                ('slug', models.SlugField(max_length=25, unique=True, help_text="Lowercase name for the key with dashes instead of spaces. Will be\n        used in URL's.")),
                ('tone', models.CharField(max_length=2, help_text='The tone for the key. Will be used for displaying the possible keys\n        for a certain tonality.', choices=[('Cb', 'Cb'), ('C', 'C'), ('C#', 'C#'), ('Db', 'Db'), ('D', 'D'), ('D#', 'D#'), ('Eb', 'Eb'), ('E', 'E'), ('E#', 'E#'), ('Fb', 'Fb'), ('F', 'F'), ('F#', 'F#'), ('Gb', 'Gb'), ('G', 'G'), ('G#', 'G#'), ('Ab', 'Ab'), ('A', 'A'), ('A#', 'A#'), ('Bb', 'Bb'), ('B', 'B'), ('B#', 'B#')])),
                ('tonality', models.PositiveSmallIntegerField(help_text='The tonality for this key. Will be used for finding the\n        right key when transposing, because we want to transpose to the same\n        tonality.', choices=[(1, 'Major'), (2, 'Minor')])),
                ('distance_from_c', models.PositiveSmallIntegerField(help_text='The distance the root note from this key has from the C note. This\n        should be expressed in the amount of half notes to go up to reach the\n        C. If the root not is C this will be 0. It will be used for finding the\n        right key when transposing.')),
                ('order', models.PositiveSmallIntegerField(help_text='The order the keys of\n        a certain tonality should appear in.')),
            ],
            options={
                'unique_together': set([('tonality', 'order')]),
                'ordering': ('order',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Chart',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('song', models.ForeignKey(to_field='id', to='songs.Song', help_text='The song this chart descripes.')),
                ('key', models.ForeignKey(to_field='id', to='chordcharts.Key', help_text='The key the chart is in. If the\n        some sections of the song have deviating keys you can overwrite this in\n        the section.')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('key', models.ForeignKey(to_field='id', to='chordcharts.Key', help_text="The key this note belongs to. Doesn't necessarily have to be a note\n        IN the key. We also specify out-of-key notes so the system won't have\n        to guess how to represend them.")),
                ('name', models.CharField(max_length=2, help_text='The name for the note. Should be a letter from A to G and possibly a\n        flat (b) or sharp (#) sign.')),
                ('distance_from_root', models.PositiveSmallIntegerField(help_text='The distance this note has from the root note of the associated key.\n        If this IS the root note, the distance is 0.')),
                ('key_note', models.BooleanField(default=False, help_text="Indicates if\n        this note is a note that really is IN the key. We also specify\n        out-of-key notes so the system won't have to guess how to represend\n        them.")),
            ],
            options={
                'ordering': ('distance_from_root',),
            },
            bases=(models.Model,),
        ),
    ]
