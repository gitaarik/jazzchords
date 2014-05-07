#!/usr/bin/env python3
import os
import sys

if __name__ == '__main__':

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
    from django.core.management import execute_from_command_line

    # Disable django.contrib.staticfiles from serving the static files, because
    # we serve the static files ourselfs with nocache headers.
    if 'runserver' in sys.argv and '--nostatic' not in sys.argv:
        sys.argv.append('--nostatic')

    execute_from_command_line(sys.argv)
