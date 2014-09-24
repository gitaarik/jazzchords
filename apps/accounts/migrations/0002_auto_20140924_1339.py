# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='email',
            field=models.EmailField(error_messages={'invalid': 'Sorry but this email address is not valid.', 'blank': 'Please fill in your email address. We use it to reset your password in case you lost it.', 'max_length': 'An email address can at most have 254 characters.', 'unique': ''}, max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='password',
            field=models.CharField(error_messages={'blank': 'Please create a password.', 'max_length': 'Please create a password with max 50 characters.'}, max_length=50, validators=[django.core.validators.MinLengthValidator(8, "Please choose a password that's at least 8 characters long.")]),
        ),
    ]
