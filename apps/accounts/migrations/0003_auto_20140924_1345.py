# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20140924_1339'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='email',
            field=models.EmailField(max_length=254, unique=True, error_messages={'max_length': 'An email address can at most have 254 characters.', 'blank': 'Please fill in your email address. We use it to reset your password in case you lost it.', 'unique': 'pfehw', 'invalid': 'Sorry but this email address is not valid.'}),
        ),
        migrations.AlterField(
            model_name='account',
            name='validation_token',
            field=models.CharField(max_length=50, blank=True),
        ),
    ]
