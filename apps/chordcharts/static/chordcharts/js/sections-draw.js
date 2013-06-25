$(function() {

    for(var i in settings.sections) {

        var section = $($('.section-sidebar')[i])

        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')

        canvas.style.position = 'absolute'
        canvas.width = settings.section_sidebar_width 
        canvas.height = settings.sections[i].height 

        context.lineWidth = settings.border_width 

        // from top to title
        context.beginPath()
        context.moveTo(settings.section_sidebar_width / 2, Math.round(settings.box_height * 0.1))
        context.lineTo(settings.section_sidebar_width / 2, ((settings.sections[i].height / 2) - 5 - Math.round(settings.box_height * 0.1)))
        context.stroke()

        // from top to right
        context.beginPath()
        context.moveTo(settings.section_sidebar_width / 2, Math.round(settings.box_height * 0.1))
        context.lineTo(settings.section_sidebar_width - 5, Math.round(settings.box_height * 0.1))
        context.stroke()

        // from title to bottom
        context.beginPath()
        context.moveTo(settings.section_sidebar_width / 2, (settings.sections[i].height / 2) + 5 + Math.round(settings.box_height * 0.1))
        context.lineTo(settings.section_sidebar_width / 2, (settings.sections[i].height - Math.round(settings.box_height * 0.1)))
        context.stroke()

        // from bottom to right
        context.beginPath()
        context.moveTo(settings.section_sidebar_width / 2 , (settings.sections[i].height - Math.round(settings.box_height * 0.1)))
        context.lineTo(settings.section_sidebar_width - 5, (settings.sections[i].height - Math.round(settings.box_height * 0.1)))
        context.stroke()

        section.append(canvas)

        i++

    }

})
