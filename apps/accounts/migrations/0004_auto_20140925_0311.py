# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20140924_1345'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='password',
        ),
        migrations.AddField(
            model_name='account',
            name='password_encoded',
            field=models.CharField(default='none', error_messages={'blank': 'Please create a password.', 'max_length': 'Please create a password with max 50 characters.'}, max_length=128, validators=[django.core.validators.MinLengthValidator(8, "Please choose a password that's at least 8 characters long.")]),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='account',
            name='email',
            field=models.EmailField(error_messages={'blank': 'Please fill in your email address. We use it to reset your password in case you lost it.', 'invalid': 'Sorry but this email address is not valid.', 'max_length': 'An email address can at most have 254 characters.', 'unique': 'bla'}, unique=True, max_length=254),
        ),
    ]
