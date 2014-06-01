# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations
import autoslug.fields


class Migration(migrations.Migration):

    dependencies = [
        ('songs', '0002_auto_20140529_0610'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='slug',
            field=autoslug.fields.AutoSlugField(editable=False, max_length=150),
        ),
    ]
