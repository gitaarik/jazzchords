import json

from django.shortcuts import render, redirect, get_object_or_404
from django.core.urlresolvers import reverse
from django.core.exceptions import ObjectDoesNotExist
from django.http import (
    HttpResponse, HttpResponseBadRequest, HttpResponseRedirect,
    HttpResponsePermanentRedirect, HttpResponseForbidden, Http404
)
from django.contrib.auth.decorators import login_required

from songs.models import Song

from .models import Chart, Key, ChordType
from .forms import CreateChartForm
from .settings import BOXED_CHART
from .helpers.keys_json import keys_json


def chart(request, song_slug, chart_id, key_tonic=None, edit=False):
    """
    Renders the view for the chart.

    Could be the normal chart or view edit version. In case of the edit
    version, `edit` should be `True`.
    """

    def get_key(chart, key_tonic):
        """
        Returns the key for the given `key_tonic` or `None` if
        `key_tonic` was invalid.
        """
        if key_tonic:
            try:
                return Key.objects.get(
                    tonic=key_tonic,
                    tonality=chart.key.tonality
                )
            except ObjectDoesNotExist:
                return None
        else:
            return None

    def get_chart_data(edit, key):

        kwargs = {
            'edit': edit
        }

        if key:
            kwargs['transpose_to_tonic'] = key.tonic

        return chart.client_data(**kwargs)

    def get_chord_types_sets(chord_types):
        """
        Returns two sets of chord types lists.
        """
        return (chord_types[:12], chord_types[12:])

    def get_chord_types_json(chord_types):
        """
        Returns the JSON representation of the given `chord_types`.
        """
        return json.dumps(
            [chord_type.client_data() for chord_type in chord_types]
        )

    def get_redirect(chart, key, song_slug, key_tonic, edit, can_edit):
        """
        Returns a redirect response in case it's necessary.

        It can be necessary if the given `song_slug` isn't equal to the
        chart's song's slug, and/or if the given `key_tonic` is invalid,
        and/or `edit` is `True` but `can_edit` is `False`. Otherwise
        returns `None`.
        """

        redirect = False
        reverse_kwargs = {}

        if edit and not can_edit:
            redirect = 'temporary'
            edit = False

        if song_slug != chart.song.slug:
            redirect = 'permanent'

        if key_tonic:
            if key:
                reverse_kwargs['key_tonic'] = key_tonic
            else:
                # If `key` is `None`, it means that the `key_tonic` was
                # invalid. In this case we want to redirect, so it will
                # go to the default key.
                redirect = 'temporary'

        if redirect:

            reverse_kwargs['chart_id'] = chart.id
            reverse_kwargs['song_slug'] = chart.song.slug

            if redirect == 'permanent':
                redirect_class = HttpResponsePermanentRedirect
            else:
                redirect_class = HttpResponseRedirect

            if edit:
                view = 'chordcharts:edit_chart'
            else:
                view = 'chordcharts:chart'

            return redirect_class(reverse(view, kwargs=reverse_kwargs))

    def show_chart(chart, key, edit, can_edit):

        if edit:
            # Only clean up the chart in edit mode, because if we always
            # do it it might become a bit too much. Besides that,
            # "unclean" charts should work nevertheless.
            chart.cleanup()

        chart_data = get_chart_data(edit, key)
        all_keys = Key.objects.all()
        chart_keys = all_keys.filter(tonality=chart.key.tonality)
        chord_types = ChordType.objects.all()
        has_other_versions = chart.song.charts.count() > 1

        context = {
            'settings': BOXED_CHART,
            'settings_json': json.dumps(BOXED_CHART),
            'chart': chart_data,
            'chart_json': json.dumps(chart_data),
            'chart_keys': chart_keys,
            'all_keys_json': keys_json(all_keys),
            'chord_types_sets': get_chord_types_sets(chord_types),
            'chord_types_json': get_chord_types_json(chord_types),
            'can_edit': can_edit,
            'edit': edit,
            'key_select_tonics': Key.TONIC_CHOICES,
            'has_other_versions': has_other_versions
        }

        return render(request, 'chordcharts/chart/base.html', context)

    chart = get_object_or_404(Chart, id=chart_id)
    can_edit = request.user.has_perm('change', chart)
    edit = edit and can_edit
    key = get_key(chart, key_tonic)
    response = get_redirect(
        chart, key, song_slug, key_tonic, edit, can_edit
    )

    if not response:

        if not (chart.public or can_edit):
            response = render(request, 'chordcharts/chart-not-public.html')
        else:
            response = show_chart(chart, key, edit, can_edit)

    return response


def search(request, search_term=None):

    song = None

    if search_term:
        try:
            song = Song.objects.get(name=search_term)
        except ObjectDoesNotExist:
            pass

    if song:
        results = song.charts
    else:
        results = Chart.objects

    results = results.public_or_owned(request.user)
    username = request.GET.get('user')

    if username:
        results = results.filter(owner__username=username)

    context = {
        'search_term': search_term,
        'username': username,
        'results': results
    }

    return render(request, 'chordcharts/search.html', context)


@login_required
def new_chart(request):
    """
    Returns a view where you can create new charts.
    """

    def get_keys():
        """
        Returns a dict with a list of keys for each tonality.
        """

        keys = {}

        for key in Key.objects.all():

            if key.tonality not in keys:
                keys[key.tonality] = []

            keys[key.tonality].append(key)

        return keys

    response = None
    context = {}
    create_chart_form = CreateChartForm(request.POST)

    if request.method == 'POST':

        if create_chart_form.is_valid():
            chart = create_chart_form.save(request.user)
            response = redirect(
                'chordcharts:edit_chart',
                song_slug=chart.song.slug,
                chart_id=chart.id
            )
        else:
            context.update({
                'data': create_chart_form.data,
                'errors': create_chart_form.errors
            })

    if not response:

        keys = get_keys()

        context.update({
            'fields': create_chart_form.fields,
            'all_keys_json': keys_json(Key.objects.all()),
            'key_select_tonics': Key.TONIC_CHOICES,
            'keys_major': keys[Key.TONALITY_MAJOR],
            'keys_minor': keys[Key.TONALITY_MINOR]
        })

        response = render(request, 'chordcharts/new-chart.html', context)

    return response


def delete_chart(request, song_slug, chart_id):
    """
    On a POST, will delete the chart with id `chart_id`.
    """

    if request.method == 'POST':

        try:
            chart = Chart.objects.get(id=chart_id)
        except ObjectDoesNotExist:
            response = HttpResponseBadRequest('Song not found')
        else:

            if request.user.has_perm('delete', chart):

                song = chart.song
                chart.delete()

                if song.charts.count() == 0:
                    song.delete()

                context = {
                    'song_name': request.POST.get('song_name')
                }

                response = render(
                    request,
                    'chordcharts/chart-deleted.html',
                    context
                )

            else:
                response = HttpResponseForbidden()

    else:
        response = HttpResponse(status=405)

    return response


def how_to_read(request):
    context = {
        'settings_json': json.dumps(BOXED_CHART),
    }
    return render(request, 'chordcharts/how-to-read.html', context)


def chord_symbols(request):

    context = {
        'chord_types': ChordType.objects.all()
    }

    return render(request, 'chordcharts/chord-symbols.html', context)
