# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20140925_0311'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='password_encoded',
            field=models.CharField(max_length=128),
        ),
        migrations.AlterField(
            model_name='account',
            name='username',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]
