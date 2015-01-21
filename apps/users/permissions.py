from copy import copy
from django.db import models
from rest_framework.permissions import BasePermission


class UserPermissions(BasePermission):

    def has_permission(self, request, view):

        if (
            request.method == 'POST' and
            not request.user.is_superuser and
            not has_related_field_permissions(view, request)
        ):
            return False
        else:
            return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):

        if request.method in ['GET', 'OPTIONS']:
            permission = 'read'
        elif request.method in ['PUT', 'PATCH']:
            permission = 'change'
        elif request.method == 'DELETE':
            permission = 'delete'
        else:
            raise Exception(
                "Can't do a {} request on an instance.".format(request.method)
            )

        return request.user.has_perm(permission, obj)


def has_related_field_permissions(view, request):
    """
    Returns a boolean indicating whether the user has permissions to
    related fields of the object in the view. This only works for views
    that have a `model` or `queryset` attribute.
    """

    obj = get_proposed_obj(view, request)
    allowed = True

    if obj:

        for field_name in getattr(obj, 'related_field_permissions', []):

            field = getattr(obj, field_name, None)
            assert field, ("No such related field: {}".format(field_name))
            field_class = obj._meta.get_field_by_name(field_name)[0]

            if isinstance(field_class, models.ForeignKey):
                allowed = field.has_permission(request.user, 'change')
            else:
                raise Exception(
                    "Related field type `{}` not supported for "
                    "checking related permissions.".format(field)
                )

            if not allowed:
                break

    return allowed

def get_proposed_obj(view, request):
    """
    Returns the object that the request is proposing to create, or
    `None` if the data isn't valid or the view has no `model`.
    """
    serializer = view.get_serializer(data=request.data)
    if serializer.is_valid() and hasattr(serializer.Meta, 'model'):
        data = copy(serializer.validated_data)
        serializer.complete_data(data)
        return serializer.Meta.model(**data)
