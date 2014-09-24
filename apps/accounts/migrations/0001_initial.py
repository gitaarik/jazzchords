# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators
import accounts.models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(error_messages={'unique': 'Sorry, this username is already taken.', 'max_length': 'A username can at most have 50 characters.', 'blank': 'Please choose a username.'}, max_length=50, unique=True, validators=[django.core.validators.MinLengthValidator(2, 'A username should have at least 2 characters.')])),
                ('email', models.EmailField(error_messages={'unique': "fu", 'max_length': 'An email address can at most have 254 characters.', 'blank': 'Please fill in your email address. We use it to confirm ownership in case you lost your password.', 'invalid': 'Sorry but this email address is not valid.'}, max_length=254, unique=True)),
                ('password', models.CharField(error_messages={'max_length': 'Please choose a password with max 50 characters.', 'blank': 'Please create a password.'}, max_length=50, validators=[django.core.validators.MinLengthValidator(8, "Please choose a password that's at least 8 characters long.")])),
                ('validated', models.BooleanField(default=False)),
                ('validation_token', models.CharField(max_length=50)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
