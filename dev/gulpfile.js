var gulp = require('gulp');
var minimist = require('minimist');
var glob = require('glob');
var es = require('event-stream');
var source = require('vinyl-source-stream')
var rename = require('gulp-rename');
var path = require('path');
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

    function parse_file(file, rename_func) {
        return (
            options.build_stream_func(file)
            .pipe(rename(rename_func))
            .pipe(gulp.dest(options.dest_dir))
        );
    }

    var all_files = glob.sync(
        options.src_dir + '**/*.' + options.src_ext
    );

    if (filters.length) {

        all_files = all_files.filter(function(file) {
            return filters.filter(function(filter) {
                return file.indexOf(filter) > -1;
            }).length;
        });

    }

    var main_file_name = '_main.' + options.src_ext;
    var main_files = all_files.filter(function(file) {
        return (
            file.slice(-(main_file_name.length + 1)) ==
            '/' + main_file_name
        );
    });

    var main_file_dirs = [];

    main_files.map(function(file) {
        main_file_dirs.push(
            file.slice(0, -main_file_name.length)
        );
    });

    var other_files = [];
    var include_file;

    all_files.map(function(file) {

        include_file = true;

        main_file_dirs.map(function(main_file_dir) {
            if (file.slice(0, main_file_dir.length) == main_file_dir) {
                include_file = false
            }
        });

        if (include_file) {
            other_files.push(file);
        }

    });

    var rename_func = function(filepath) {
        filepath.basename = path.basename(filepath.dirname);
        filepath.dirname = path.dirname(filepath.dirname);
    };

    streams = main_files.map(function(file) {
        return parse_file(file, rename_func);
    });

    streams = streams.concat(other_files.map(function(file) {
        return parse_file(file, function(){ });
    }));

    return es.merge.apply(streams);

}

gulp.task('parsecss', function() {

    parse_static({
        src_dir: root_dir + 'css/',
        src_ext: 'less',
        build_stream_func: function(file) {
            return gulp.src(file, { base: '.' }).pipe(less());
        },
        parse_func: less,
        dest_dir: static_dir + 'css',
        dest_ext: 'css'
    });

});

gulp.task('parsejs', function() {

    parse_static({
        src_dir: root_dir + 'js/',
        src_ext: 'js',
        build_stream_func: function(file) {
            return browserify(file).bundle().pipe(source(file));
        },
        parse_func: browserify,
        dest_dir: static_dir + 'js',
        dest_ext: 'js'
    });

});

gulp.task('parsestatic', ['parsecss', 'parsejs']);

gulp.task('watchit', function () {

    var args = minimist(process.argv);
    var extra_filters = args.f;

    if (extra_filters) {
        filters = filters.concat(extra_filters.split(' '));
    }

    gulp.watch(root_dir + 'css/**', ['parsecss']);
    gulp.watch(root_dir + 'js/**', ['parsejs']);

});
