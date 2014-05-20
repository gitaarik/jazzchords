from django.core.management.base import BaseCommand
from chordcharts.models import Line


class Command(BaseCommand):

    def handle(self, *args, **options):

        for line in Line.objects.all():
            if not line.letter:
                line.letter = 'A'
                line.save()
