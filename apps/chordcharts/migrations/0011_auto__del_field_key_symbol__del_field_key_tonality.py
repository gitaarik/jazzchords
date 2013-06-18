# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Key.symbol'
        db.delete_column(u'chordcharts_key', 'symbol')

        # Deleting field 'Key.tonality'
        db.delete_column(u'chordcharts_key', 'tonality')


    def backwards(self, orm):

        # User chose to not deal with backwards NULL issues for 'Key.symbol'
        raise RuntimeError("Cannot reverse this migration. 'Key.symbol' and its values cannot be restored.")

        # User chose to not deal with backwards NULL issues for 'Key.tonality'
        raise RuntimeError("Cannot reverse this migration. 'Key.tonality' and its values cannot be restored.")

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
            'Meta': {'ordering': "('position',)", 'unique_together': "(('chart_section', 'position'),)", 'object_name': 'Item'},
            'alternative_bass_tone': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'beats': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '4'}),
            'chart_section': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Section']"}),
            'chord_pitch': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'chord_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.ChordType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'position': ('django.db.models.fields.PositiveSmallIntegerField', [], {})
        },
        u'chordcharts.key': {
            'Meta': {'object_name': 'Key'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '25'})
        },
        u'chordcharts.pitch': {
            'Meta': {'ordering': "('distance_from_root',)", 'object_name': 'Pitch'},
            'distance_from_root': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Key']"}),
            'key_tone': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '2'})
        },
        u'chordcharts.section': {
            'Meta': {'ordering': "('position',)", 'unique_together': "(('chart', 'position'),)", 'object_name': 'Section'},
            'chart': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Chart']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['chordcharts.Key']"}),
            'line_width': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '8'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
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