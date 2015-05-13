from django.db import models


class ChartManager(models.Manager):

    def public_or_owned(self, user=None):
        """
        Returns all charts that are either public or owned by the given
        `user`. The given `user` can be `None`, then it will only return
        public charts.
        """
        return self.get_queryset().filter(public=True)
