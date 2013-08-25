from django import template

register = template.Library()

@register.filter
def colspan(measures):
    return 8 - len(measures)
