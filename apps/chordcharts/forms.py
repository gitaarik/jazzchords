from django.forms import ModelForm
from .models import Chart


class CreateChartForm(ModelForm):

    song_name = SongNameField()

    class Meta:
        model = Chart
        fields = ['short_description', 'video_url', 'lyrics_url']
