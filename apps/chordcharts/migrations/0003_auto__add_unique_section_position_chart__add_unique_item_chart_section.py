# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding unique constraint on 'Section', fields ['position', 'chart']
        db.create_unique(u'chordcharts_section', ['position', 'chart_id'])

        # Adding unique constraint on 'Item', fields ['chart_section', 'position']
        db.create_unique(u'chordcharts_item', ['chart_section_id', 'position'])


    def backwards(self, orm):
        # Removing unique constraint on 'Item', fields ['chart_section', 'position']
        db.delete_unique(u'chordcharts_item', ['chart_section_id', 'position'])

        # Removing unique constraint on 'Section', fields ['position', 'chart']
        db.delete_unique(u'chordcharts_section', ['position', 'chart_id'])


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