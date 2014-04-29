from rest_framework import serializers
from .models import Section, Line


class SectionSerializer(serializers.ModelSerializer):

    def restore_object(self, attrs, instance=None):

        if instance is None:
            # if `instance` is `None`, it means we're creating a new
            # object, so we set the `chart_id` field.
            attrs['chart_id'] = self.context['chart_id']

        return super(SectionSerializer, self).restore_object(attrs, instance)

    class Meta:
        model = Section
        fields = (
            'id',
            'key_distance_from_chart',
            'number',
            'alt_name',
            'time_signature'
        )


class LineSerializer(serializers.ModelSerializer):

    def restore_object(self, attrs, instance=None):

        if instance is None:
            # if `instance` is `None`, it means we're creating a new
            # object, so we set the `section_id` field.
            attrs['section_id'] = self.context['section_id']

        return super(LineSerializer, self).restore_object(attrs, instance)

    class Meta:
        model = Line
        fields = ('id', 'number')
