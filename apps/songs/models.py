from django.db import models


class Song(models.Model):

    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=50)

    def __unicode__(self):
        return self.name

    def client_data(self):
        return {
            'name': self.name,
            'slug': self.slug
        }
