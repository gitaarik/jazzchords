# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20140916_0321'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.CharField(unique=True, max_length=250),
        ),
        migrations.AlterField(
            model_name='user',
            name='email_verification_token',
            field=models.CharField(default=users.models.User.generate_token, max_length=50),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(unique=True, max_length=50),
        ),
    ]
