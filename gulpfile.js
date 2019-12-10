const {src, dest, task, watch, series, parallel} = require('gulp');
const coffee = require('gulp-coffee');
const uglify = require('gulp-uglify');
const minify = require('gulp-minify');
const stylus = require('gulp-stylus');
const jade = require('gulp-jade');
const browserSync = require('browser-sync').create();

const paths = {
	public: './dist',
	coffee: {
		src: './src/coffee/*.coffee',
		dest: './dist/js',
		watch: './src/coffee'
	},
	jade: {
		src: './src/*.jade',
		dest: './dist',
		watch: './src'
	},
	stylus: {
		src: './src/stylus/*.styl',
		dest: './dist/css',
		watch: './src/stylus'
	}
};

// compile coffeescript into JavaScript and reload browser
task('coffee', function() {
  return src(paths.coffee.src, { sourcemaps: true })
    .pipe(coffee({bare: true}))
    .pipe(minify())
    .pipe(dest(paths.coffee.dest))
    .pipe(browserSync.stream());
})

// include, if you want to work with sourcemaps
// const sourcemaps = require('gulp-sourcemaps');
//
// compile Stylus into CSS and reload browser
task('stylus', function() {
  return src(paths.stylus.src)
    .pipe(stylus())
    .pipe(dest(paths.stylus.dest))
    .pipe(browserSync.stream());
})

// compile Jade into HTML and reload browser
task('jade', function() {
  const LOCALS = {};
  return src(paths.jade.src)
    .pipe(jade({
      locals: LOCALS
    }))
    .pipe(dest(paths.jade.dest))
    .pipe(browserSync.stream());
});

// Start static server and watch source files
task('serve', function() {
  browserSync.init({
      server: {
          baseDir: paths.public
      }
  });
  watch(paths.jade.watch, series('jade'));
  watch(paths.coffee.watch, series('coffee'));
  watch(paths.stylus.watch, series('stylus'));
});

task('build', parallel('jade', 'coffee', 'stylus'));
task('default', series('build', 'serve'));
