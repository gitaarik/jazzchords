var BoxedChart = {}

// Bind data from server to models/collections

var boxed_chart_model = new BoxedChart.Models.BoxedChart(
    boxed_chart_data)

var editWidget_chordTypes = new BoxedChart.Collections.editWidgetChordType(
    chord_types_data)


// Bind views and models to existing HTML

var boxed_chart = new BoxedChart.Views.BoxedChart({
    el: '.chord-chart .boxed-chart'
})

var section_number = 0
var last_box = null

// Loop through HTML elements and create appropriate views/models for these
// elements
boxed_chart.$el.find('.section').each(function() {

    var line_number = 0
    var section_model = boxed_chart_model.get('sections').models[section_number]
    section_model.set('boxed_chart', boxed_chart.model)

    var section = new BoxedChart.Views.Section({
        el: this,
        model: section_model
    })
    boxed_chart.$el.append(section)

    section.$el.find('.chord-boxes .line').each(function() {

        var box_number = 0
        var line_model = section.model.get('lines').models[line_number]
        line_model.set('section', section.model)

        var line = new BoxedChart.Views.Line({
            el: this,
            model: line_model
        })
        section.$el.append(line)

        line.$el.find('.box').each(function() {

            var part_number = 0
            var box_model = line.model.get('boxes').models[box_number]
            box_model.set('line', line.model)

            var box = new BoxedChart.Views.Box({
                el: this,
                model: box_model
            })

            if(last_box) {
                box.model.set('prev_box', last_box.model)
                last_box.model.set('next_box', box.model)
            }

            last_box = box
            line.$el.append(box)

            box.$el.find('.part').each(function() {

                var boxPart_model = box.model.get('parts').models[part_number]
                boxPart_model.set('box', box.model)

                var boxPart = new BoxedChart.Views.BoxPart({
                    el: this,
                    model: boxPart_model
                })
                part_number++

            })

            box_number++

        })

        line_number++

    })

    section_number++

})
