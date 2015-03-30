var gulp = require('gulp');
var glob = require('glob');
var es = require('event-stream');
var source = require('vinyl-source-stream')
var less = require('gulp-less');
var browserify = require('browserify');
var watchify = require('watchify');


// Root directory of the repository, relative from this file.
var root_dir = '../';

// Static files directory, where the parsed files should be placed.
var static_dir = root_dir + 'dev/static/';

/**
 * Returns all files that don't start with an underscore in the given `rootDir`
 * with the given `extension`.
 */
function getMainFiles(rootDir, extension) {

    var all_files = glob.sync(rootDir + '**/*.' + extension);

    return all_files.filter(function(file) {

        var filename = file.replace(/.*\//, '');

        if (filename[0] == '_') {
            return false;
        } else {
            return true;
        }

    });

}

/**
 * Parses the Javascript files.
 *
 * If the `watch` argument is `true`, then it will watch the files for changes
 * and reparse them when necessary.
 */
function parseJs(watch) {

    var mainJsFiles = getMainFiles(root_dir + 'js/', 'js');

    var streams = mainJsFiles.map(function(file) {

        var b = browserify(file, watchify.args);

        function parseFunc() {

            console.log('parsing ' + file);

            b
              .bundle()
              .pipe(source(file))
              .pipe(gulp.dest(static_dir + 'js'));

        }

        parseFunc();

        if (watch) {
            watchify(b).on('update', parseFunc);
        }

    });

    return es.merge.apply(streams);

}

/**
 * Parses the CSS files.
 */
function parseCss() {

    var mainJsFiles = getMainFiles(root_dir + 'css/', 'less');

    var streams = mainJsFiles.map(function(file) {

        gulp
          .src(file, { base: '.' })
          .pipe(less())
          .pipe(gulp.dest(static_dir + 'css'));

    });

    return es.merge.apply(streams);

}


gulp.task('parsejs', function() { parseJs() });
gulp.task('parsecss', function() { parseCss() });
gulp.task('parsestatic', ['parsecss', 'parsejs']);

gulp.task('watch', function() {
    parseCss();
    gulp.watch(root_dir + 'css/**', ['parsecss']);
    parseJs(true);
});

gulp.task('default', ['watch']);
