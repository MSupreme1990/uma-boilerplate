let path = require('path'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    flatten = require('gulp-flatten'),
    fs = require('fs'),
    csso = require('gulp-csso'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    nunjucks = require('gulp-nunjucks'),
    data = require('gulp-data'),
    browserSync = require('browser-sync').create();

let settings = {
    scsso: {},
    sass: {},
    paths: {
        templates: [
            '!./templates/base.html',
            './templates/**/*.html'
        ],
        images: './images/**/*{.jpg,.png,.svg}',
        fonts: './fonts/**/*{.eot,.otf,.woff,.woff2,.ttf,.svg}',
        css: './scss/**/*.scss'
    },
    dst: {
        templates: './build',
        css: './build/css',
        images: './build/images',
        fonts: './build/fonts'
    }
};

gulp.task('fonts', () => {
    return gulp.src(settings.paths.fonts)
        .pipe(flatten())
        .pipe(gulp.dest(settings.dst.fonts));
});

gulp.task('images', () => {
    return gulp.src(settings.paths.images)
        .pipe(gulp.dest(settings.dst.images))
        .pipe(browserSync.stream());
});

gulp.task('css', ['fonts'], () => {
    return gulp.src(settings.paths.css)
        .pipe(plumber())
        .pipe(sass(settings.sass).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('bundle.css'))
        .pipe(csso(settings.scsso))
        .pipe(gulp.dest(settings.dst.css))
        .pipe(browserSync.stream());
});

gulp.task('watch', ['templates'], () => {
    browserSync.init({
        server: {
            baseDir: path.join(__dirname, "build"),
            index: "index.html",
            // Static routes
            routes: {
                "/bower_components": "bower_components"
            }
        },
        open: false,
    });

    watch('./build/js/**/*.js', () => {
        browserSync.reload();
    });
    watch([].concat(settings.paths.css, settings.paths.fonts), () => {
        gulp.start('css');
    });
    watch('./templates/**/*.html', () => {
        gulp.start('templates');
        browserSync.reload();
    });
});

gulp.task('templates', () => {
    return gulp.src(settings.paths.templates)
        .pipe(plumber())
        .pipe(data(file => {
            let basename = path.basename(file.relative, '.html'),
                dirname = path.dirname(path.resolve(path.join('./templates', file.relative))),
                dataFile = path.join(dirname, basename + '.json');

            return fs.existsSync(dataFile) ? require(dataFile) : {};
        }))
        .pipe(nunjucks.compile())
        .pipe(gulp.dest(settings.dst.templates));
});

gulp.task('default', () => {
    return gulp.start('templates', 'css', 'images');
});
