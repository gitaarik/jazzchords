from rest_framework import serializers
from songs.models import Song
from .models import Chart, Section, Line, Measure, Chord, ChordType, Key


class CompleteDataMixin():

    def create(self, data):
        self.complete_data(data)
        return super().create(data)


class ChartSerializer(serializers.ModelSerializer):

    song_id = serializers.PrimaryKeyRelatedField(
        source='song',
        queryset=Song.objects.all()
    )

    class Meta:
        model = Chart
        fields = (
            'id',
            'song_id',
            'short_description',
            'video_url',
            'lyrics_url'
        )


class SectionSerializer(CompleteDataMixin, serializers.ModelSerializer):

    key_id = serializers.PrimaryKeyRelatedField(
        source='key',
        queryset=Key.objects.all()
    )

    def get_key_id(self, obj):
        return obj.key.id

    def complete_data(self, data):
        data['chart_id'] = self.context['chart_id']

    class Meta:
        model = Section
        fields = (
            'id',
            'key_id',
            'number',
            'name',
            'time_signature',
            'show_sidebar'
        )


class LineSerializer(CompleteDataMixin, serializers.ModelSerializer):

    def complete_data(self, data):
        data['section_id'] = self.context['section_id']

    merge_with_next_line = serializers.BooleanField()

    class Meta:
        model = Line
        fields = ('id', 'number', 'letter', 'merge_with_next_line')


class MeasureSerializer(CompleteDataMixin, serializers.ModelSerializer):

    def complete_data(self, data):
        data['line_id'] = self.context['line_id']

    class Meta:
        model = Measure
        fields = ('id', 'number', 'beat_schema')


class ChordSerializer(CompleteDataMixin, serializers.ModelSerializer):

    chord_type_id = serializers.PrimaryKeyRelatedField(
        source='chord_type',
        queryset=ChordType.objects.all()
    )

    def complete_data(self, data):
        data['measure_id'] = self.context['measure_id']

    class Meta:
        model = Chord
        fields = (
            'id',
            'number',
            'beats',
            'chord_type_id',
            'chord_pitch',
            'alt_bass',
            'alt_bass_pitch',
            'rest',
            # hier moet key_id bij komen:
            #'key_id'
        )
