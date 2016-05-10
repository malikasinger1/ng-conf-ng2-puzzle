var gulp = require('gulp');

var replace = require('gulp-replace-task');
var assetsDev = 'assets/';
var assetsProd = 'src/';
var del = require('del');
var appDev = 'dev/';
var appProd = 'app/';

/* Mixed */
var ext_replace = require('gulp-ext-replace');

/* CSS */
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnano = require('cssnano');

/* JS & TS */
var jsuglify = require('gulp-uglify');
var typescript = require('gulp-typescript');

/* Images */
var imagemin = require('gulp-imagemin');


/* build modes */
var buildModes = {
    GITHUB: 1,
    LOCAL:2
}
/* checking if build is for github */
var buildMode = buildModes.GITHUB;

var tsProject = typescript.createProject('tsconfig.json');

var cssPath = (buildMode==buildModes.GITHUB)? 'stylesheets' : 'css';
var jsPath = (buildMode==buildModes.GITHUB)? 'javascripts' : 'js';
var imagesPath = (buildMode==buildModes.GITHUB)? 'images' : 'img';

gulp.task('build-css', function () {
    return gulp.src(assetsDev + 'scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(postcss([precss, autoprefixer, cssnano]))
        .pipe(sourcemaps.write())
        .pipe(ext_replace('.css'))
        .pipe(gulp.dest(appProd + cssPath));
});

gulp.task('build-ts', function () {
    return gulp.src(appDev + '**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))
        .pipe(sourcemaps.write())
        //.pipe(jsuglify())
        .pipe(gulp.dest(appProd + jsPath));
});

gulp.task('build-img', function () {
    return gulp.src(assetsDev + 'img/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(assetsProd + imagesPath));
});

gulp.task('build-html', ['build-ts', 'build-css','build-img','copy:libs'], function () {
    var replacePatterns = [{
                    match: /node_modules\/es6-shim\/es6-shim.min.js/,
                    replacement: jsPath + '/lib/es6-shim.min.js'
                },
                {
                    match:/node_modules\/angular2\/bundles\/angular2-polyfills.js/,
                    replacement: jsPath + '/lib/angular2-polyfills.js'
                },
                {
                    match: /node_modules\/systemjs\/dist\/system-polyfills.js/,
                    replacement: jsPath + '/lib/system-polyfills.js'
                }, 
                {
                    match:/node_modules\/angular2\/es6\/dev\/src\/testing\/shims_for_IE.js/,
                    replacement: jsPath + '/lib/shims_for_IE.js'
                },
                {
                    match: /node_modules\/systemjs\/dist\/system.src.js/,
                    replacement: jsPath + '/lib/system.src.js'
                },
                {
                    match: /node_modules\/rxjs\/bundles\/Rx.js/,
                    replacement: jsPath + '/lib/Rx.js'    
                },
                {
                    match: /node_modules\/angular2\/bundles\/angular2.dev.js/,
                    replacement: jsPath + '/lib/angular2.dev.js'
                },
                {
                    match: /node_modules\/angular2\/bundles\/angular2.js/,
                    replacement: jsPath + '/lib/angular2.js'
                },
                {
                    match: /node_modules\/angular2\/bundles\/http.js/,
                    replacement: jsPath + '/lib/http.js'
                },
                {
                    match: /node_modules\/angular2\/bundles\/router.dev.js/,
                    replacement: jsPath + '/lib/router.dev.js'    
                }];
                if(buildMode==buildModes.GITHUB){
                    replacePatterns.push({
                        match: /<base href="\/">/,
                        replacement: '<base href="/ng-conf-ng2-puzzle/">'
                    });
                    replacePatterns.push({
                        match: /href="app\/css\/app.css"/,
                        replacement: 'href="css/app.css"'
                    });
                    replace({
                        match: /System\.import(\'app\/boot\')/,
                        replacement: "System.import('boot')"
                    });
                }
    return gulp.src([appDev + '**/*.html','index.html'])
        .pipe(replace({patterns: replacePatterns}))
        .pipe(gulp.dest(appProd));
});

gulp.task('watch', function () {
    gulp.watch(appDev + '**/*.ts', ['build-ts']);
    gulp.watch(assetsDev + 'scss/**/*.scss', ['build-css']);
    gulp.watch(assetsDev + 'img/*', ['build-img']);
});


gulp.task('clean', function () {
  return del('app/**/*');
});

// copy dependencies
gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
      '<script src="node_modules/es6-shim/es6-shim.min.js',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
      'node_modules/angular2/bundles/angular2.js', 
      'node_modules/angular2/bundles/http.js',
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',
      'node_modules/angular2/bundles/angular2.dev.js',
      'node_modules/angular2/bundles/router.dev.js'
    ])
    .pipe(gulp.dest(appProd + jsPath + '/lib'))
});

gulp.task('default', ['watch', 'build-ts', 'build-css']);
gulp.task('build',['build-html']);