# If you change these settings, don't forget to also make these changes in the
# LESS CSS settings in settings.less.

LINE_MAX_MEASURES = 8

BOXED_CHART = {
    'box_width': 100,
    'box_height': 100,
    'border_width': 1,
    'section_sidebar_width': 40,
}

BOXED_CHART['chart_width'] = (
    LINE_MAX_MEASURES * (
        BOXED_CHART['box_width']
        + BOXED_CHART['border_width']
    )
    + BOXED_CHART['border_width']
    + BOXED_CHART['section_sidebar_width']
)
