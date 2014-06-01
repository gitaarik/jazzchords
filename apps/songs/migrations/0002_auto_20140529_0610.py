# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('songs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='slug',
            field=models.SlugField(max_length=150),
        ),
        migrations.AlterField(
            model_name='song',
            name='name',
            field=models.CharField(max_length=150),
        ),
    ]
