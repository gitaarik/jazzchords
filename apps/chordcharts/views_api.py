from rest_framework import viewsets
from .serializers import SectionSerializer
from .models import Section


class SectionViewSet(viewsets.ModelViewSet):

    model = Section
    serializer_class = SectionSerializer

    def get_queryset(self, *args, **kwargs):
        return Section.objects.filter(
            chart__song__slug=self.kwargs['song_slug']
        )
