from ..settings import BOXED_CHART


class BoxedChart(object):
    '''
    A boxed chart.

    This object provides global information about the boxed chart
    representation of the chart.
    '''

    def __init__(self, chart):
        self.chart = chart

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
    self.boxes          - The boxes, this is a list of ChartBox objects.
    self.height         - The height.
    self.width          - The width.
    self.box_count      - The number of boxes.
    self.line_count     - The number of lines.
    '''

    def __init__(self, section):
        '''
        Initializes the object based on the given section.

        This will calculate the following variables:
        self.boxes          - The boxes, this is a list of ChartBox objects.
        self.height         - The height.
        self.width          - The width.
        self.box_count      - The number of boxes.
        self.line_count     - The number of lines.
        '''

        self.section = section
        self.boxes = []
        self.box_progress = 0
        self.line_count = 1
        self.box_count = 0
        self.last_chord_notation = None

        self.current_box = self.new_box()
        self.generate_boxes()
        self.height = self.calculate_height()
        self.width = self.calculate_width()

    def generate_boxes(self):
        '''
        Get sections for chart.
        '''

        for self.current_item in self.section.item_set.all():
            self.current_beats = self.current_item.beats
            self.add_boxes()

    def new_box(self):
        '''
        Get a new box.
        '''
        return ChartBox(self.box_count)

    def add_current_box_to_chart(self):

        if (self.box_count > 0 # first box is already on new line
            and self.box_count % self.section.line_width == 0):
            self.current_box.starts_on_new_line = True
            self.line_count += 1
        else:
            self.current_box.starts_on_new_line = False

        self.box_count += 1
        self.boxes.append(self.current_box)

    def add_boxes(self):
        '''
        Add boxes based on current_item
        '''

        if self.current_beats < (5 - self.box_progress):
            self.box_add_item(self.current_beats)
        else:
            self.add_boxes_over_four_beats()

        self.box_progress = (self.box_progress + self.current_beats) % 4

        if self.box_progress == 0 and len(self.current_box.items):
            self.add_current_box_to_chart()
            self.current_box = self.new_box()

    def add_boxes_over_four_beats(self):
        '''
        Adds boxes for items that have over 4 beats
        '''

        if self.box_progress:
            self.finish_box()

        if self.current_beats:
            self.add_full_boxes()

        beats_left = self.current_beats % 4

        if beats_left:
            self.box_add_item(beats_left)

    def finish_box(self):
        '''
        Finish a previously started box.
        '''

        # if current box is not finished yet, finish it

        beats_to_finish = 4 - self.box_progress
        self.box_add_item(beats_to_finish)

        self.add_current_box_to_chart()

        # now number has decreased the amount of beats that were used
        # to finish current_box

        self.current_beats -= beats_to_finish
        self.current_box = self.new_box()

    def add_full_boxes(self):
        '''
        Add full boxes (boxes with items with 4 beats).
        '''

        for i in range(self.current_beats / 4):
            self.box_add_item(4)
            self.add_current_box_to_chart()
            self.current_box = self.new_box()

    def box_add_item(self, beats):
        '''
        Add item to box.
        '''

        chord_notation = self.current_item.chord_notation

        if beats == 4 and chord_notation == self.last_chord_notation:
            chart_chord = '%'
        else:
            chart_chord = chord_notation

        self.last_chord_notation = chord_notation
        self.current_box.items.append(ChartBoxItem(chart_chord, beats))

    def calculate_height(self):

        return ((
            self.line_count *
            (BOXED_CHART['box_height'] + BOXED_CHART['border_width'])
        ) + BOXED_CHART['border_width'])

    def calculate_width(self):

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
    self.starts_on_new_line         - Indicates if the box should start on a
                                      new line.
    self.items                      - The ChartBoxItems in this ChartBox.
    '''

    def __init__(self, position):
        self.items = []
        self.position = position

    def beat_schema(self):
        '''
        A representation of the durations of the items in this box.

        The format is: each duration represented as a number, seperated by
        dashes. For example:
        2-2     - First item 2 beats, second item two beats.
        2-1-1   - First item 2 beats, second item 1 beat, third item 1 beat.
        4       - First (and only) item 4 beats.
        '''
        return u'-'.join([unicode(item.beats) for item in self.items])


class ChartBoxItem(object):
    '''
    This represents an item in a chart box.

    Variables on this object:
    self.chord      - The chord.
    self.beats      - The amount of beats the chord should be played.
    '''

    def __init__(self, chord, beats):
        self.chord = chord
        self.beats = beats
