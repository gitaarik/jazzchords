# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chordcharts', '0014_auto_20141005_0607'),
    ]

    operations = [
        migrations.AddField(
            model_name='chart',
            name='owner',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name='charts', default=2),
            preserve_default=False,
        ),
    ]
