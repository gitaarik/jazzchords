from ..settings import BOXED_CHART


class BoxedChart(object):
    '''
    A boxed chart.

    This object provides global information about the boxed chart
    representation of the chart.
    '''

    def __init__(self, chart):
        self.chart = chart

    def client_data(self):
        '''
        Get the data required for a client side application. For example,
        a webapp or an Android app.

        It will return a dictionary with the following keys:
        sections - a list of sections
        '''

        return {
            'sections': [section.client_data()
                for section in self.sections()]
        }

    def sections(self):
        '''
        The `BoxedChartSection`s in this BoxedChart.
        '''

        sections = []

        for section in self.chart.section_set.all():
            sections.append(section.boxed_chart())

        return sections

    def total_width(self):
        '''
        The total width the boxed chart will be.

        This includes the width of the section sidebar.
        '''
        return self.chart_width() + self.section_sidebar_width()

    def chart_width(self):
        '''
        The width of the chart without the section sidebar.
        '''

        widest_section = 0

        for section in self.chart.section_set.all():
            section_width = section.boxed_chart().width
            if section_width > widest_section:
                widest_section = section_width

        return widest_section

    def section_sidebar_width(self):
        '''
        The width of the section sidebar.
        '''
        return BOXED_CHART['section_sidebar_width']


class BoxedChartSection(object):
    '''
    A boxed chart for a certain section.

    On initialization of this object, the object will calculate the following
    variables:
    self.lines          - The lines, this is a list with lists of ChartBox
                          objects.
    self.height         - The height.
    self.width          - The width.
    self.box_count      - The number of boxes.
    '''

    def __init__(self, section):
        '''
        Initializes the object based on the given section.

        This will calculate the following variables:
        self.lines          - The lines, this is a list with lists of ChartBox
                              objects.
        self.height         - The height.
        self.width          - The width.
        self.box_count      - The number of boxes.
        '''

        self.section = section
        self.lines = []
        self.box_progress = 0 # the progress of generating a box
        self.box_count = 0 # the total number of boxes
        self.line_box_count = 0 # the number of boxes on the current line
        self.current_line = [] # the current line (will be appended to
                               # self.lines)
        self.last_box = None # last box that was created, used for determining
                             # when repeat sign ( % ) should show up.

        self.current_box = self.new_box()
        self.generate_section()
        self.height = self.calculate_height()
        self.width = self.calculate_width()

    def client_data(self):
        '''
        Get the data required for a client side application. For example,
        a webapp or an Android app.

        It will return a dictionary with the following keys:
        lines - a list of lines
        '''

        return {
            'key': self.section.key().client_data(),
            'lines': [
                {'boxes': [box.client_data() for box in line]}
                for line in self.lines
            ]
        }

    def generate_section(self):
        '''
        Generate the section chart.

        Loops through the section's items and generate boxes for them.
        '''

        for item in self.section.item_set.all():
            self.generate_boxes(item)

        self.lines.append(self.current_line)

    def new_box(self):
        '''
        Get a new box.

        A box represents one measure (at the moment we only suport 4/4
        measures). In this measure there can be one or multiple items
        (ChartBoxPart) that contain the chords and their duration.
        '''

        # ChartBox's __init__ function takes `position` as first argument.
        # `self.box_count` starts with 0 and will only increase when the box is
        # added to the chart (in add_current_box_to_current_line), and a new
        # box is only created when the previous box has been added. So we can
        # use `self.box_count` here to determin the position of the box in the
        # chart.
        return ChartBox(self.box_count)

    def generate_boxes(self, item):
        '''
        Generate boxes based on given item.

        Will look at the item (`Item`, an item in the section) and determines
        how many boxes it should generate and what properties they have. It can
        be that an item will generate a half box or one and a half or something
        like that, then the next item will finish the box this item started.
        '''

        # check if this item fits in `self.current_box`
        if item.beats < (5 - self.box_progress):
            self.box_add_part(item, item.beats)
        else:
            self.add_multiple_boxes(item)

        self.box_progress = (self.box_progress + item.beats) % 4

        if self.box_progress == 0 and len(self.current_box.parts):
            self.add_current_box_to_current_line()
            self.current_box = self.new_box()

    def add_current_box_to_current_line(self):
        '''
        Add the current box to the current line.
        '''

        # if line is full, start new line
        if (self.line_box_count > 0 # first box is already on new line
            and self.line_box_count % self.section.line_width == 0):
            self.lines.append(self.current_line)
            self.current_line = []
            self.line_box_count = 0

        self.box_count += 1
        self.line_box_count += 1
        self.current_line.append(self.current_box)

        # self.current_box is appended so set self.last_box to self.current_box
        # and self.current_box to a new box
        self.last_box = self.current_box
        self.current_box = self.new_box()

    def add_multiple_boxes(self, item):
        '''
        Adds multiple boxes to chart.
        '''

        beats = item.beats

        # if current box is not finished yet, finish it
        if self.box_progress:
            beats = self.finish_box(item, beats)

        if beats > 3:
            self.add_full_boxes(item, beats)

        beats_left = beats % 4

        if beats_left:
            self.box_add_part(item, beats_left)

    def finish_box(self, item, beats):
        '''
        Finishes a previously started box.

        Returns the beats that are left after finishing the box.
        '''

        beats_to_finish = 4 - self.box_progress
        self.box_add_part(item, beats_to_finish)
        self.add_current_box_to_current_line()

        return beats - beats_to_finish

    def add_full_boxes(self, item, beats):
        '''
        Add full boxes (boxes with items with 4 beats).
        '''

        for i in range(beats / 4):
            self.box_add_part(item, 4)
            self.add_current_box_to_current_line()

    def box_add_part(self, item, beats):
        '''
        Add part to box.
        '''

        chord_notation = item.chord_notation()
        chart_output = chord_notation
        note = item.note()
        chord_type = item.chord_type
        alt_bass_note = item.alternative_base_note()

        # If self.current_item has 4 beats (thus is a full box) and isn't the
        # first item on a line and self.last_box was a full box too and had the
        # same chord_notation, then the chart_output will be a '%' (which is
        # the repeat sign).
        if (beats == 4 and self.line_box_count > 0 and self.last_box and
            self.last_box.beat_schema() == '4' and
            chord_notation == self.last_box.parts[0].chord_notation):
            chart_output = '%'

        self.current_box.parts.append(ChartBoxPart(chord_notation,
            chart_output, note, chord_type, alt_bass_note, beats))

    def calculate_height(self):
        '''
        Calculate height for this boxed chart section.
        '''

        return ((
            len(self.lines) *
            (BOXED_CHART['box_height'] + BOXED_CHART['border_width'])
        ) + BOXED_CHART['border_width'])

    def calculate_width(self):
        '''
        Calculate width for this boxed chart section.
        '''

        return (
            (self.section.line_width *
                (BOXED_CHART['box_width'] + BOXED_CHART['border_width'])) +
            BOXED_CHART['border_width']
        )


class ChartBox(object):
    '''
    This represents a box in the boxed chart.

    Variables on this object:
    self.position                   - The position of the box. This defines the
                                      order of the boxes.
    self.parts                      - The `ChartBoxPart`s in this `ChartBox`.
    '''

    def __init__(self, position):
        self.parts = []
        self.position = position

    def client_data(self):

        return {
            'position': self.position,
            'beat_schema': self.beat_schema(),
            'parts': [part.client_data() for part in self.parts]
        }

    def beat_schema(self):
        '''
        A representation of the durations of the parts in this box.

        The format is: each duration represented as a number, seperated by
        dashes. For example:
        2-2     - First item 2 beats, second item two beats.
        2-1-1   - First item 2 beats, second item 1 beat, third item 1 beat.
        4       - First (and only) item 4 beats.
        '''
        return u'-'.join([unicode(part.beats) for part in self.parts])


class ChartBoxPart(object):
    '''
    This represents an item in a chart box.

    Variables on this object:
    self.chord_notation         - the full notation of the chord
    self.chart_output           - the notation of the chord as it appears in
                                  the output (here a repeat sign '%' could be
                                  used)
    self.note                   - the root note of the chord
    self.chord_type             - the type of chord
    self.alt_bass_note          - alternative base note if there is one
    self.beats                  - the beats the chord should be played
    '''

    def __init__(self, chord_notation, chart_output, note, chord_type,
        alt_bass_note, beats):
        self.chord_notation = chord_notation
        self.chart_output = chart_output
        self.note = note
        self.chord_type = chord_type
        self.alt_bass_note = alt_bass_note
        self.beats = beats

    def client_data(self):

        client_data = {
            'note': self.note.client_data(),
            'chord_type': self.chord_type.client_data(),
            'beats': self.beats
        }

        if self.alt_bass_note:
            client_data['alt_bass_note'] = self.alt_bass_note.client_data()
        else:
            client_data['alt_bass_note'] = False

        return client_data
