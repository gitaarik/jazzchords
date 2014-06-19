from rest_framework import viewsets
from .serializers import SongSerializer
from .models import Song


class SongViewSet(viewsets.ModelViewSet):
    model = Song
    serializer_class = SongSerializer
    queryset = Song.objects.all()
