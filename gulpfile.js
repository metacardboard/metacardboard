/*jshint node:true */
/* gulpfile.js - https://github.com/gulpjs/gulp */

// for mocha
require('coffee-script/register');

var
/** node.js **/
path = require('path'),
fs = require('fs'),

/** Gulp and plugins **/
gulp = require('gulp'),
gutil = require('gulp-util'),
watch = require('gulp-watch'),
plumber = require('gulp-plumber'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
mocha = require('gulp-mocha'),
coffee = require('gulp-coffee'),

/** utility **/
through = require('through2').obj,

/** webpack **/
webpack = require('webpack'),
webpackconfig = require('./webpack.config'),
webpackserver = require("webpack-dev-server"),

jade = require('jade'),
stylus = require('stylus'),

/** Config **/
srcCoffeeDir = './coffee/',
srcAppDir = './app/',
destDir = './src/',

distDir = './dist/',
distTargetFile = 'metacardboard.js',

/** Environment Vars **/
R = 0,
ENV_SWITCH = void 0,

// Env list
DEV_ENV = R++,
PROD_ENV = R++;


/** Utility Functions **/

// Transformation function on gulp.src depending on env
var getGlob = function(glob_target, opts) {
  var
  opts = opts || {},
  src = gulp.src(glob_target, opts);


  switch(ENV_SWITCH) {
    case DEV_ENV:

        // watch files and re-emit them downstream on change (or some file event)
        opts.glob = glob_target;

        return watch(opts)


    case PROD_ENV:
      return src.pipe(plumber());

    default:
      throw new Error('Invalid Env');
  }
};

/* Sub-tasks */
gulp.task('set-dev', function() {
    ENV_SWITCH = DEV_ENV;
});

gulp.task('set-prod', function() {
    ENV_SWITCH = PROD_ENV;
});


gulp.task('mocha', function() {

    var mocha_opts = {};

    try {
        var opts = fs.readFileSync('test/mocha.opts', 'utf8')
            .trim()
            .split(/\s+/);

        opts.forEach(function(val, indx, arry) {
            if (/^-.+?/.test(val)) {
                val = val.replace(/^-+(.+?)/, "$1");
                mocha_opts[val] = arry[indx + 1];
            }
        });

    } catch (err) {
      // ignore
    }

    return watch({ glob: 'test/**/*.coffee', read:false }, function(files) {

        files
            .pipe(mocha(mocha_opts))
                .on('error', function(err) {
                    if (!/tests? failed/.test(err.stack)) {
                        console.log(err.stack);
                    }
                });
    });

});

gulp.task('dist-minify', function() {

    return getGlob(distDir + '/' + distTargetFile)
        .pipe(rename({ suffix: '.min'}))
        .pipe(uglify({ outSourceMap: true }))
        .pipe(gulp.dest(distDir));
});

gulp.task('coffee', function() {

    var target = path.normalize(srcCoffeeDir + '/**/*.coffee');

    getGlob(target)
        .on('data', function(file){
            file.coffee_path = file.path;
        })
        .pipe(plumber())
        .pipe(coffee({bare: true}))
            .on('error', gutil.beep)
            .on('error', gutil.log)
        .pipe(gulp.dest(destDir))
            .on('data', function(file) {

                var to = path.normalize(destDir + '/' + path.relative(__dirname + '/' + srcCoffeeDir, file.path));
                finalDestFilePath = path.normalize(destDir + '/' + path.basename(file.path));

                var from = path.relative(__dirname, file.coffee_path);

                gutil.log("Compiled '" + from + "' to '" + to + "'");

            });

});

gulp.task('webpack', function(callback) {

    webpack(webpackconfig, function(err, stats) {

        if(err) throw new gutil.PluginError("webpack", err);

        gutil.log("[webpack]", stats.toString({
            // output options
        }));

    });

    var myConfig = Object.create(webpackconfig);


    new webpackserver(webpack(myConfig), {
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });

    return callback();

});

gulp.task('app', function(callback) {

    var
    jade_files = path.normalize(srcAppDir + '/**/*.jade');
    stylus_files = path.normalize(srcAppDir + '/**/*.styl');

    // jade processing (html)
    getGlob(jade_files)
        .pipe(plumber())
        .pipe(through(function(file, _, cb) {

            jade.render(file.contents.toString('utf8'), {}, function(err, html) {

                if (err)
                    return cb(err);

                file.contents = new Buffer(html);

                return cb(null, file);

            });

        }))
        .pipe(rename({ extname: '.html'}))
        .pipe(gulp.dest(srcAppDir));

    // stylus processing (css)
    getGlob(stylus_files)
        .pipe(plumber())
        .pipe(through(function(file, _, cb) {

            stylus(file.contents.toString('utf8'))
                // TODO: change this to dynamic
                .set('filename', 'app.css')
                .render(function(err, css){

                    if (err)
                        return cb(err);


                    file.contents = new Buffer(css);

                    return cb(null, file);
                });
        }))
        .pipe(rename({ extname: '.css'}))
        .pipe(gulp.dest(srcAppDir));

    return callback();

});

/* High-level tasks */
/* Compose sub-tasks to orchestrate something to be done */

/* Development task */
gulp.task('dev', ['set-dev', 'coffee', 'webpack', 'mocha', 'app'], function() {
    // Run webpack based on config from webpack.config.js
});


gulp.task('prod', ['set-prod', 'dist-minify'], function() {
    // Minify file and generate dist source map file.
});


// The default task (called when you run `gulp`)
gulp.task('default', ['dev'], function() {
    // Run dev task by default
});
