from django.core.urlresolvers import reverse
from django.http.response import HttpResponseRedirect
from django.utils.functional import SimpleLazyObject
from django.shortcuts import render


def frontpage(request):
    return render(request, 'core/frontpage.html')
