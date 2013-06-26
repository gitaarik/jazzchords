$(function() {

    for(var i in settings.sections) {

        var section_element = $($('.section-sidebar')[i])
        var section_obj = settings.sections[i]
        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        var line_margin = 0.15

        canvas.style.position = 'absolute'
        canvas.width = settings.section_sidebar_width 
        canvas.height = section_obj.height 

        context.lineWidth = settings.border_width 

        if(section_obj.alt_title) {

            // from top to bottom
            context.beginPath()
            context.moveTo(
                settings.section_sidebar_width / 2,
                Math.round(settings.box_height * line_margin))
            context.lineTo(
                settings.section_sidebar_width / 2,
                (settings.sections[i].height
                 - Math.round(settings.box_height * line_margin)))
            context.stroke()

        }
        else {

            // from top to title
            context.beginPath()
            context.moveTo(
                settings.section_sidebar_width / 2,
                Math.round(settings.box_height * line_margin))
            context.lineTo(settings.section_sidebar_width / 2,
                ((settings.sections[i].height / 2) - 5
                 - Math.round(settings.box_height * line_margin)))
            context.stroke()

            // from title to bottom
            context.beginPath()
            context.moveTo(
                settings.section_sidebar_width / 2,
                (settings.sections[i].height / 2) + 5
                + Math.round(settings.box_height * line_margin))
            context.lineTo(
                settings.section_sidebar_width / 2,
                (settings.sections[i].height
                 - Math.round(settings.box_height * line_margin)))
            context.stroke()

        }

        // from top to right
        context.beginPath()
        context.moveTo(
            settings.section_sidebar_width / 2,
            Math.round(settings.box_height * line_margin))
        context.lineTo(
            settings.section_sidebar_width - 5,
            Math.round(settings.box_height * line_margin))
        context.stroke()

        // from bottom to right
        context.beginPath()
        context.moveTo(
            settings.section_sidebar_width / 2 ,
            (settings.sections[i].height -
             Math.round(settings.box_height * line_margin)))
        context.lineTo(
            settings.section_sidebar_width - 5,
            (settings.sections[i].height -
             Math.round(settings.box_height * line_margin)))
        context.stroke()

        section_element.append(canvas)

        i++

    }

})
