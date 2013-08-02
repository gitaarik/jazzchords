BoxedChart.Collections = {}

BoxedChart.Collections.BoxPart = Backbone.Collection.extend({
    model: BoxedChart.Models.BoxPart
})

BoxedChart.Collections.Box = Backbone.Collection.extend({
    model: BoxedChart.Models.Box
})

BoxedChart.Collections.Line = Backbone.Collection.extend({
    model: BoxedChart.Models.Line
})

BoxedChart.Collections.Section = Backbone.Collection.extend({
    model: BoxedChart.Models.Section
})

BoxedChart.Collections.editWidgetChordType = Backbone.Collection.extend({
    model: BoxedChart.Models.ChordType
})
