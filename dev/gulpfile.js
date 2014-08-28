var gulp = require('gulp');
var glob = require('glob');
var es = require('event-stream');
var rename = require('gulp-rename');
var less = require('gulp-less');
var browserify = require('gulp-browserify');


function parse_static(params) {

    /**
     * Parses only the app root directory files.
     */
    function normal_files() {

        return gulp.src(params.src_dir + '*/*.' + params.src_ext)
                   .pipe(params.parse_func())
                   .pipe(gulp.dest(params.dest_dir));

    }

    /**
     * Parses _main.less files in subdirectories of the app directory.
     */
    function main_files() {

        var main_files = glob.sync(
            params.src_dir + '*/*/_main.' + params.src_ext
        );
        var file_regex = new RegExp(
            params.src_dir + '([^/]+)/([^/]+)/_main.' + params.src_ext
        );
        var streams;

        return main_files.map(function(file) {

            var matches = file_regex.exec(file)

            return (
                gulp.src(file)
                    .pipe(params.parse_func())
                    .pipe(rename(
                        matches[1] + '/' +
                        matches[2] + '.' +
                        params.dest_ext
                    ))
                    .pipe(gulp.dest(params.dest_dir))
            );

        });

    }

    streams = main_files(); + [normal_files()];

    return es.merge.apply(streams);

}

gulp.task('parsestatic', function() {

    parse_static({
        src_dir: '../css/',
        src_ext: 'less',
        parse_func: less,
        dest_dir: '../static/css',
        dest_ext: 'css'
    });

    parse_static({
        src_dir: '../js/',
        src_ext: 'js',
        parse_func: browserify,
        dest_dir: '../static/js',
        dest_ext: 'js'
    });

});

gulp.task('watchit', function () {
    gulp.watch(['../css/**', '../js/**'], ['parsestatic'])
});
