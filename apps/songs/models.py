from django.db import models
from autoslug import AutoSlugField


class Song(models.Model):

    name = models.CharField(max_length=150)
    slug = AutoSlugField(populate_from='name', max_length=150)

    def __str__(self):
        return self.name

    def client_data(self):
        return {
            'name': self.name,
            'slug': self.slug
        }
