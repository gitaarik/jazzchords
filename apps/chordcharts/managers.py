from django.db import models
from django.db.models import Q


class ChartManager(models.Manager):

    def public_or_owned(self, user=None):
        """
        Returns all charts that are either public or owned by the given
        `user`. The given `user` can be `None`, then it will only return
        public charts.
        """

        if user.is_anonymous():
            filters = Q(public=True)
        else:
            filters = Q(public=True) | Q(owner=user)

        return self.get_queryset().filter(filters)
