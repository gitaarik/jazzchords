from django.shortcuts import render


def frontpage(request):
    return render(request, 'frontpage.html')


def coming_soon(request):
    return render(request, 'coming-soon.html')
