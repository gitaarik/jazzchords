from django.core.management.base import BaseCommand
from chordcharts.models import Line


class Command(BaseCommand):

    def handle(self, *args, **options):

        for line in Line.objects.all():

            result = False

            try:
                result = line.section
            except:
                pass
            else:

                if not result:
                    line.section = line.subsection.section
                    line.save()
