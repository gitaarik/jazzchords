var gulp = require('gulp');
var minimist = require('minimist');
var glob = require('glob');
var es = require('event-stream');
var source = require('vinyl-source-stream')
var less = require('gulp-less');
var browserify = require('browserify');

// Root directory of the repository, relative from this file.
var root_dir = '../';
var dev_dir = root_dir + 'dev/';

// Static files directory, where the parsed files should be placed.
var static_dir = dev_dir + 'static/';

// Filters to use when searching for files to parse.
var filters = [];

function parse_static(options) {

    var all_files = glob.sync(
        options.src_dir + '**/*.' + options.src_ext
    );

    all_files = all_files.filter(function(file) {

        var filename = file.replace(/.*\//, '');

        if (filename[0] == '_') {
            return false;
        } else {
            return true;
        }

    });

    if (filters.length) {

        all_files = all_files.filter(function(file) {
            return filters.filter(function(filter) {
                return file.indexOf(filter) > -1;
            }).length;
        });

    }

    var streams = all_files.map(function(file) {
        options.build_stream_func(file)
        .pipe(gulp.dest(options.dest_dir))
    });

    return es.merge.apply(streams);

}

gulp.task('parsecss', function() {

    parse_static({
        src_dir: root_dir + 'css/',
        src_ext: 'less',
        build_stream_func: function(file) {
            return gulp.src(file, { base: '.' }).pipe(less());
        },
        dest_dir: static_dir + 'css'
    });

});

gulp.task('parsejs', function() {

    parse_static({
        src_dir: root_dir + 'js/',
        src_ext: 'js',
        build_stream_func: function(file) {
            return browserify(file).bundle().pipe(source(file));
        },
        dest_dir: static_dir + 'js'
    });

});

gulp.task('parsestatic', ['parsecss', 'parsejs']);

gulp.task('watchit', function() {

    var args = minimist(process.argv);
    var extra_filters = args.f;

    if (extra_filters) {
        filters = filters.concat(extra_filters.split(' '));
    }

    gulp.watch(root_dir + 'css/**', ['parsecss']);
    gulp.watch(root_dir + 'js/**', ['parsejs']);

});

gulp.task('default', ['parsestatic', 'watchit']);
