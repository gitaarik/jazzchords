# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chordcharts', '0007_auto_20140512_1248'),
    ]

    operations = [
        migrations.AddField(
            model_name='line',
            name='letter',
            field=models.CharField(max_length=1, help_text='The letter the line has. This will show up in the sidebar of the\n            section', choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')], default='A'),
            preserve_default=True,
        ),
        #migrations.AddField(
        #    model_name='line',
        #    name='section',
        #    field=models.ForeignKey(default=0, to='chordcharts.Section', to_field='id', help_text='The section this line belongs to.'),
        #    preserve_default=False,
        #),
        migrations.AddField(
            model_name='section',
            name='show_sidebar',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.RemoveField(
            model_name='line',
            name='subsection',
        ),
        migrations.RemoveField(
            model_name='section',
            name='use_subsections',
        ),
        migrations.AlterField(
            model_name='note',
            name='key_note',
            field=models.BooleanField(help_text="Indicates if this note is a note that really is IN the key. We\n            also specify out-of-key notes so the system won't have to guess how\n            to represend them.", default=False),
        ),
        migrations.AlterField(
            model_name='chord',
            name='order',
            field=models.PositiveSmallIntegerField(help_text='The order for the chord. Will be used to determine the order of\n            the chords.'),
        ),
        migrations.AlterField(
            model_name='chordtype',
            name='symbol',
            field=models.CharField(max_length=10, help_text='The symbol for the chord type. For example: m (for Major), m\n            (for Minor), 7 (for Seventh). This will be used for choosing a\n            chord type in the edit widget.'),
        ),
        migrations.AlterField(
            model_name='chord',
            name='alt_bass_pitch',
            field=models.PositiveSmallIntegerField(help_text='The alternative bass tone in the chord. As with the Chord Pitch,\n            it is the amount of half notes the chord note is away from the root\n            of the key the item will be presented in. These half steps should\n            be upwards in the scale. It will only be used if `Use Alternative\n            Bass` is set.', default=0),
        ),
        migrations.AlterField(
            model_name='key',
            name='distance_from_c',
            field=models.PositiveSmallIntegerField(help_text='The distance the root note from this key has from the C note.\n            This should be expressed in the amount of half notes to go up to\n            reach the C. If the root not is C this will be 0. It will be used\n            for finding the right key when transposing.'),
        ),
        migrations.AlterField(
            model_name='section',
            name='alt_name',
            field=models.CharField(max_length=25, help_text='Alternative title for the section. Normally a section\n        get\'s assigned a letter (starting with A, next B etc.) which is\n        displayed left of the section\'s boxed chart. If you fill in this\n        "alternative title" this title will be shown on top of the section\'s\n        boxed chart. This is appropriate for an intro, outro or maybe a bridge\n        which isn\'t a regularry repeating section in the song.', blank=True),
        ),
        migrations.AlterField(
            model_name='chart',
            name='key',
            field=models.ForeignKey(help_text='The key the chart is in. If the some sections of the song have\n            deviating keys you can overwrite this in the section.', to='chordcharts.Key', to_field='id'),
        ),
        migrations.AlterField(
            model_name='chord',
            name='alt_bass',
            field=models.BooleanField(help_text='Indicates if the chord has an alternative tone in the bass.', default=False),
        ),
        migrations.AlterField(
            model_name='key',
            name='tone',
            field=models.CharField(max_length=2, help_text='The tone for the key. Will be used for displaying the possible\n            keys for a certain tonality.', choices=[('Cb', 'Cb'), ('C', 'C'), ('C#', 'C#'), ('Db', 'Db'), ('D', 'D'), ('D#', 'D#'), ('Eb', 'Eb'), ('E', 'E'), ('E#', 'E#'), ('Fb', 'Fb'), ('F', 'F'), ('F#', 'F#'), ('Gb', 'Gb'), ('G', 'G'), ('G#', 'G#'), ('Ab', 'Ab'), ('A', 'A'), ('A#', 'A#'), ('Bb', 'Bb'), ('B', 'B'), ('B#', 'B#')]),
        ),
        migrations.AlterField(
            model_name='note',
            name='distance_from_root',
            field=models.PositiveSmallIntegerField(help_text='The distance this note has from the root note of the associated\n            key. If this IS the root note, the distance is 0.'),
        ),
        migrations.AlterField(
            model_name='key',
            name='slug',
            field=models.SlugField(max_length=25, unique=True, help_text="Lowercase name for the key with dashes instead of spaces. Will\n            be used in URL's."),
        ),
        migrations.AlterField(
            model_name='chordtype',
            name='name',
            field=models.CharField(max_length=50, help_text='The human understandable name that descripes the chord type. For\n            example: Major, Major Seven, Ninth, Diminished etc.'),
        ),
        migrations.AlterField(
            model_name='measure',
            name='beat_schema',
            field=models.CharField(max_length=13, help_text='The type of beatschema for this measure. This is related to the\n            chords that are in the measure. If the measure has one chord that\n            is played for 4 beats, the beatschema is "4", if the measure has\n            two chords that are both played for 2 beats, the beatschema is\n            "2-2", if the measure has three chords where the first one is\n            played 2 beats and the other two one 1 beat, the beatschema is\n            "2-1-1" etc.'),
        ),
        migrations.AlterField(
            model_name='line',
            name='number',
            field=models.PositiveSmallIntegerField(help_text='The number for the line. Will be used to determine the order of\n            the lines.'),
        ),
        migrations.AlterField(
            model_name='chordtype',
            name='chord_output',
            field=models.CharField(max_length=10, help_text='The way the symbol will be displayed when used in a chord.\n            Usually this is the same as the normal symbol, but for some chords\n            it might be different. For example, a Major chord is usually\n            written without a symbol. This will be used for the chord\n            representation in the chart.\n            ', blank=True),
        ),
        migrations.AlterField(
            model_name='key',
            name='tonality',
            field=models.PositiveSmallIntegerField(help_text='The tonality for this key. Will be used for finding the right\n            key when transposing, because we want to transpose to the same\n            tonality.', choices=[(1, 'Major'), (2, 'Minor')]),
        ),
        migrations.AlterField(
            model_name='chord',
            name='chord_pitch',
            field=models.PositiveSmallIntegerField(help_text='The relative pitch for the chord. This is the amount of half\n            notes the chord note is away from the root of the key the item will\n            be presented in. These half steps should be upwards in the\n            scale.'),
        ),
        migrations.AlterField(
            model_name='chord',
            name='chord_type',
            field=models.ForeignKey(help_text='The type of the chord. This defines the intervals inside the\n            chord.', to='chordcharts.ChordType', to_field='id'),
        ),
        migrations.AlterField(
            model_name='chord',
            name='beats',
            field=models.PositiveSmallIntegerField(help_text='The number of beats the item should be played. The current chord\n            chart representations only support 4/4 measures.', default=4),
        ),
        migrations.AlterField(
            model_name='chordtype',
            name='order',
            field=models.PositiveSmallIntegerField(help_text='The order in which the chord types will appear. This is used in\n            the edit widget. More used chords should appear before lesser used\n            chords.'),
        ),
        migrations.AlterField(
            model_name='measure',
            name='number',
            field=models.PositiveSmallIntegerField(help_text='The number for the measure. Will be used to determine the order\n            of the measures.'),
        ),
        migrations.AlterField(
            model_name='note',
            name='key',
            field=models.ForeignKey(help_text="The key this note belongs to. Doesn't necessarily have to be a\n            note IN the key. We also specify out-of-key notes so the system\n            won't have to guess how to represend them.", to='chordcharts.Key', to_field='id'),
        ),
        migrations.AlterField(
            model_name='note',
            name='name',
            field=models.CharField(max_length=2, help_text='The name for the note. Should be a letter from A to G and\n            possibly a flat (b) or sharp (#) sign.'),
        ),
        migrations.AlterField(
            model_name='key',
            name='order',
            field=models.PositiveSmallIntegerField(help_text='The order the keys of a certain tonality should appear in.'),
        ),
        migrations.DeleteModel(
            name='Subsection',
        ),
    ]
