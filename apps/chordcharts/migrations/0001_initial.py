# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Chart'
        db.create_table(u'chordcharts_chart', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('song', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['songs.Song'])),
        ))
        db.send_create_signal(u'chordcharts', ['Chart'])

        # Adding model 'Key'
        db.create_table(u'chordcharts_key', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=25)),
            ('symbol', self.gf('django.db.models.fields.CharField')(max_length=5)),
            ('tonality', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('distance_from_c', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
        ))
        db.send_create_signal(u'chordcharts', ['Key'])

        # Adding model 'Pitch'
        db.create_table(u'chordcharts_pitch', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('key', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.Key'])),
            ('distance_from_root', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
        ))
        db.send_create_signal(u'chordcharts', ['Pitch'])

        # Adding model 'Section'
        db.create_table(u'chordcharts_section', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('chart', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.Chart'])),
            ('key', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.Key'])),
            ('line_width', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=8)),
        ))
        db.send_create_signal(u'chordcharts', ['Section'])

        # Adding model 'ChordType'
        db.create_table(u'chordcharts_chordtype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('symbol', self.gf('django.db.models.fields.CharField')(max_length=10, blank=True)),
        ))
        db.send_create_signal(u'chordcharts', ['ChordType'])

        # Adding model 'Item'
        db.create_table(u'chordcharts_item', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('chart_section', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.Section'])),
            ('position', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('beats', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=4)),
            ('chord_type', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['chordcharts.ChordType'])),
            ('chord_pitch', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('chord_accidental', self.gf('django.db.models.fields.SmallIntegerField')(default=0)),
            ('alternative_bass_tone', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
        ))
        db.send_create_signal(u'chordcharts', ['Item'])


    def backwards(self, orm):
        # Deleting model 'Chart'
        db.delete_table(u'chordcharts_chart')

        # Deleting model 'Key'
        db.delete_table(u'chordcharts_key')

        # Deleting model 'Pitch'
        db.delete_table(u'chordcharts_pitch')

        # Deleting model 'Section'
        db.delete_table(u'chordcharts_section')

        # Deleting model 'ChordType'
        db.delete_table(u'chordcharts_chordtype')

        # Deleting model 'Item'
        db.delete_table(u'chordcharts_item')


    models = {
        u'chordcharts.chart': {
            'Meta': {'object_name': 'Chart'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'song': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['songs.Song']"})
        },
        u'chordcharts.chordtype': {
            'Meta': {'ordering': "('name',)", 'object_name': 'ChordType'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'symbol': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'})
        },
        u'chordcharts.item': {
            'Meta': {'ordering': "('position',)", 'object_name': 'Item'},
            'alternative_bass_tone': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'beats': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '4'}),
            'chart_section': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Section']"}),
            'chord_accidental': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'chord_pitch': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'chord_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.ChordType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'position': ('django.db.models.fields.PositiveSmallIntegerField', [], {})
        },
        u'chordcharts.key': {
            'Meta': {'object_name': 'Key'},
            'distance_from_c': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'symbol': ('django.db.models.fields.CharField', [], {'max_length': '5'}),
            'tonality': ('django.db.models.fields.PositiveSmallIntegerField', [], {})
        },
        u'chordcharts.pitch': {
            'Meta': {'ordering': "('distance_from_root',)", 'object_name': 'Pitch'},
            'distance_from_root': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Key']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '1'})
        },
        u'chordcharts.section': {
            'Meta': {'object_name': 'Section'},
            'chart': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Chart']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Key']"}),
            'line_width': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '8'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'songs.song': {
            'Meta': {'object_name': 'Song'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['chordcharts']