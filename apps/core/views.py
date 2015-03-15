from django.shortcuts import render
from django.core.mail import send_mail


def frontpage(request):
    return render(request, 'core/frontpage.html')


def about(request):
    return render(request, 'core/about/about.html')


def about_team(request):
    return render(request, 'core/about/team.html')


def about_contribute(request):
    return render(request, 'core/about/contribute.html')


def contact(request):

    sent = False

    if request.POST:

        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')

        if message:

            send_mail(
                'Jazzchords contact: {}'.format(subject),
                message,
                email,
                ['gitaarik@gmail.com']
            )

            sent = True

    context = {
        'sent': sent
    }

    return render(request, 'core/contact.html', context)
