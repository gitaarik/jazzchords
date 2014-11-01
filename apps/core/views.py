from django.shortcuts import render


def frontpage(request):
    return render(request, 'frontpage.html')


def about(request):
    return render(request, 'about.html')
