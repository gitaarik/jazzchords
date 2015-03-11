from django.shortcuts import render


def frontpage(request):
    return render(request, 'core/frontpage.html')


def about(request):
    return render(request, 'core/about/about.html')


def about_team(request):
    return render(request, 'core/about/team.html')


def about_contribute(request):
    return render(request, 'core/about/contribute.html')
