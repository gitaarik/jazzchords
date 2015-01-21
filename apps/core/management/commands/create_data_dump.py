import os
from django.core import management
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):

    def handle(self, *args, **options):

        db_dump_file = os.path.join(settings.DJANGO_ROOT, 'dev/db-dump.json')

        with open(db_dump_file, 'w') as output_file:
            management.call_command(
                'dumpdata',
                'chordcharts',
                'songs',
                'users',
                stdout=output_file
            )
