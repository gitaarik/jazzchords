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
        self.generate_section()
        self.height = self.calculate_height()
        self.width = self.calculate_width()

    def generate_section(self):
        '''
        Generate the section chart.

        Loops through the section's items and generate boxes for them.
        '''

        for item in self.section.item_set.all():
            self.generate_boxes(item)

    def new_box(self):
        '''
        Get a new box.

        A box represents one measure (at the moment we only suport 4/4
        measures). In this measure there can be one or multiple items
        (ChartBoxPart) that contain the chords and their duration.
        '''

        # ChartBox's __init__ function takes `position` as first argument.
        # `self.box_count` starts with 0 and will only increase when the box is
        # added to the chart (in add_current_box_to_chart), and a new box is
        # only created when the previous box has been added. So we can use
        # `self.box_count` here to determin the position of the box in the
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
            self.add_current_box_to_chart()
            self.current_box = self.new_box()

    def add_current_box_to_chart(self):

        if (self.box_count > 0 # first box is already on new line
            and self.box_count % self.section.line_width == 0):
            self.current_box.starts_on_new_line = True
            self.line_count += 1
        else:
            self.current_box.starts_on_new_line = False

        self.box_count += 1
        self.boxes.append(self.current_box)

    def add_multiple_boxes(self, item):
        '''
        Adds multiple boxes to chart.
        '''

        beats = item.beats

        # if current box is not finished yet, finish it
        if self.box_progress:
            beats = self.finish_box(item, beats)
            # previous box is finished so create new box
            self.current_box = self.new_box()

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
        self.add_current_box_to_chart()

        return beats - beats_to_finish

    def add_full_boxes(self, item, beats):
        '''
        Add full boxes (boxes with items with 4 beats).
        '''

        for i in range(beats / 4):
            self.box_add_part(item, 4)
            self.add_current_box_to_chart()
            self.current_box = self.new_box()

    def box_add_part(self, item, beats):
        '''
        Add part to box.
        '''

        chord_notation = item.chord_notation

        if beats == 4 and chord_notation == self.last_chord_notation:
            chart_chord = '%'
        else:
            chart_chord = chord_notation

        self.last_chord_notation = chord_notation
        self.current_box.parts.append(ChartBoxPart(chart_chord, beats))

    def calculate_height(self):
        '''
        Calculate height for this boxed chart section.
        '''

        return ((
            self.line_count *
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
    self.starts_on_new_line         - Indicates if the box should start on a
                                      new line.
    self.parts                      - The `ChartBoxPart`s in this `ChartBox`.
    '''

    def __init__(self, position):
        self.parts = []
        self.position = position

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
    self.chord      - The chord.
    self.beats      - The amount of beats the chord should be played.
    '''

    def __init__(self, chord, beats):
        self.chord = chord
        self.beats = beats
