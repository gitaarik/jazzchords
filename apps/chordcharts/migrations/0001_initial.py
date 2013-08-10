# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Key'
        db.create_table(u'chordcharts_key', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=25)),
            ('slug', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=25)),
            ('tone', self.gf('django.db.models.fields.CharField')(max_length=2)),
            ('tonality', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('distance_from_c', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('order', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
        ))
        db.send_create_signal(u'chordcharts', ['Key'])

        # Adding unique constraint on 'Key', fields ['tonality', 'order']
        db.create_unique(u'chordcharts_key', ['tonality', 'order'])

        # Adding model 'Note'
        db.create_table(u'chordcharts_note', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=2)),
            ('key', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.Key'])),
            ('distance_from_root', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('key_note', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'chordcharts', ['Note'])

        # Adding model 'ChordType'
        db.create_table(u'chordcharts_chordtype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('symbol', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('chord_output', self.gf('django.db.models.fields.CharField')(max_length=10, blank=True)),
            ('order', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
        ))
        db.send_create_signal(u'chordcharts', ['ChordType'])

        # Adding model 'Chart'
        db.create_table(u'chordcharts_chart', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('song', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['songs.Song'])),
            ('key', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.Key'])),
        ))
        db.send_create_signal(u'chordcharts', ['Chart'])

        # Adding model 'Section'
        db.create_table(u'chordcharts_section', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('chart', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.Chart'])),
            ('key_distance_from_chart', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
            ('line_width', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=8)),
            ('position', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('alt_title', self.gf('django.db.models.fields.CharField')(max_length=25, blank=True)),
        ))
        db.send_create_signal(u'chordcharts', ['Section'])

        # Adding unique constraint on 'Section', fields ['chart', 'position']
        db.create_unique(u'chordcharts_section', ['chart_id', 'position'])

        # Adding model 'Line'
        db.create_table(u'chordcharts_line', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('section', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.Section'])),
        ))
        db.send_create_signal(u'chordcharts', ['Line'])

        # Adding model 'Measure'
        db.create_table(u'chordcharts_measure', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('line', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.Line'])),
            ('position', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('beat_schema', self.gf('django.db.models.fields.CharField')(max_length=13)),
        ))
        db.send_create_signal(u'chordcharts', ['Measure'])

        # Adding model 'Chord'
        db.create_table(u'chordcharts_chord', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('measure', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.Line'])),
            ('beats', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=4)),
            ('chord_type', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.ChordType'])),
            ('chord_pitch', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('alternative_bass', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('alternative_bass_pitch', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
            ('position', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
        ))
        db.send_create_signal(u'chordcharts', ['Chord'])

        # Adding unique constraint on 'Chord', fields ['measure', 'position']
        db.create_unique(u'chordcharts_chord', ['measure_id', 'position'])


    def backwards(self, orm):
        # Removing unique constraint on 'Chord', fields ['measure', 'position']
        db.delete_unique(u'chordcharts_chord', ['measure_id', 'position'])

        # Removing unique constraint on 'Section', fields ['chart', 'position']
        db.delete_unique(u'chordcharts_section', ['chart_id', 'position'])

        # Removing unique constraint on 'Key', fields ['tonality', 'order']
        db.delete_unique(u'chordcharts_key', ['tonality', 'order'])

        # Deleting model 'Key'
        db.delete_table(u'chordcharts_key')

        # Deleting model 'Note'
        db.delete_table(u'chordcharts_note')

        # Deleting model 'ChordType'
        db.delete_table(u'chordcharts_chordtype')

        # Deleting model 'Chart'
        db.delete_table(u'chordcharts_chart')

        # Deleting model 'Section'
        db.delete_table(u'chordcharts_section')

        # Deleting model 'Line'
        db.delete_table(u'chordcharts_line')

        # Deleting model 'Measure'
        db.delete_table(u'chordcharts_measure')

        # Deleting model 'Chord'
        db.delete_table(u'chordcharts_chord')


    models = {
        u'chordcharts.chart': {
            'Meta': {'object_name': 'Chart'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Key']"}),
            'song': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['songs.Song']"})
        },
        u'chordcharts.chord': {
            'Meta': {'ordering': "('position',)", 'unique_together': "(('measure', 'position'),)", 'object_name': 'Chord'},
            'alternative_bass': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'alternative_bass_pitch': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'beats': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '4'}),
            'chord_pitch': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'chord_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.ChordType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'measure': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Line']"}),
            'position': ('django.db.models.fields.PositiveSmallIntegerField', [], {})
        },
        u'chordcharts.chordtype': {
            'Meta': {'ordering': "('order',)", 'object_name': 'ChordType'},
            'chord_output': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'symbol': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'chordcharts.key': {
            'Meta': {'ordering': "('order',)", 'unique_together': "(('tonality', 'order'),)", 'object_name': 'Key'},
            'distance_from_c': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '25'}),
            'tonality': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'tone': ('django.db.models.fields.CharField', [], {'max_length': '2'})
        },
        u'chordcharts.line': {
            'Meta': {'object_name': 'Line'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'section': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Section']"})
        },
        u'chordcharts.measure': {
            'Meta': {'object_name': 'Measure'},
            'beat_schema': ('django.db.models.fields.CharField', [], {'max_length': '13'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'line': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Line']"}),
            'position': ('django.db.models.fields.PositiveSmallIntegerField', [], {})
        },
        u'chordcharts.note': {
            'Meta': {'ordering': "('distance_from_root',)", 'object_name': 'Note'},
            'distance_from_root': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Key']"}),
            'key_note': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '2'})
        },
        u'chordcharts.section': {
            'Meta': {'ordering': "('position',)", 'unique_together': "(('chart', 'position'),)", 'object_name': 'Section'},
            'alt_title': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'}),
            'chart': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Chart']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key_distance_from_chart': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'line_width': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '8'}),
            'position': ('django.db.models.fields.PositiveSmallIntegerField', [], {})
        },
        u'songs.song': {
            'Meta': {'object_name': 'Song'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['chordcharts']