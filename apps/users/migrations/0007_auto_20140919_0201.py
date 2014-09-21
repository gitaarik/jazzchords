# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_auto_20140917_1255'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='email_validated',
            new_name='validated',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='email_validation_token',
            new_name='validation_token',
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, error_messages={'invalid': 'Sorry but this email address is not valid.', 'max_length': 'An email address can at most have 254 characters.', 'blank': 'Please fill in your email address. We use it to confirm ownership in case you lost your password.', 'unique': 'stupid system'}, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=50, validators=[django.core.validators.MinLengthValidator(8, "Please choose a password that's at least 8 characters long.")], error_messages={'max_length': 'Please choose a password with max 50 characters.', 'blank': 'Please create a password.'}),
        ),
    ]
