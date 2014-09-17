# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_auto_20140916_1337'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='email_verified',
            new_name='email_validated',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='email_verification_token',
            new_name='email_validation_token',
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(unique=True, max_length=254, error_messages={'invalid': 'Sorry but this email address is not valid.', 'blank': 'Please fill in your email address.', 'max_length': 'An email address can at most have 254 characters.'}),
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(validators=[django.core.validators.MinLengthValidator(8, "Please choose a password that's at least 8 characters long.")], max_length=50, error_messages={'blank': 'Please fill in a password.', 'max_length': 'Please choose a password with max 50 characters.'}),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(unique=True, max_length=50, error_messages={'unique': 'Sorry, this username is already taken.', 'blank': 'Please choose a username.', 'max_length': 'A username can at most have 50 characters.'}, validators=[django.core.validators.MinLengthValidator(2, 'A username should have at least 2 characters.')]),
        ),
    ]
