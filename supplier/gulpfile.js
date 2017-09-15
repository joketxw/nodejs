// author: www.xyb2b.com
// date: 2016.09 .11
// lastUpdateDate: 2016.09 .17 
// description: gulp是通过构建一个个任务机械化的帮我们完成重复性质的工作
'use strict'
// 在gulpfile中先载入gulp包，因为这个包提供了一些API
var gulp = require('gulp');
// 用来压缩hmtl的依赖包
var htmlmin = require('gulp-htmlmin');
// 用来压缩css的依赖包
var cssnano = require('gulp-cssnano');
// 最小化css文件
var minifycss = require('gulp-minify-css');
// 用于缓存的依赖包
var cache = require('gulp-cache');
// 在html里面用来压缩图片的依赖包
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
// 用来合并js或css的依赖包
var concat = require('gulp-concat');
// 用来压缩js的依赖包
var uglify = require('gulp-uglify');
// plumber配合jshint在控制台打印JS错误日记并继续把gulp流程走完的依赖包
var plumber = require('gulp-plumber');
// 给css文件自动加上浏览器前缀
var autoprefixer = require('gulp-autoprefixer');
// 用来提醒任务是否执行完毕的依赖包
var notify = require('gulp-notify');
// 引入了nodemon来做express服务器的自动重启功能
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var bs = browserSync.create();
// path
var path = require('path');
// sourcemaps...
var sourcemaps = require('gulp-sourcemaps');
//path的定义  start
var basedir = './';
var publicdir = './public';
var filepath = {
    'views': path.join(basedir, 'views/**/*.html'),
    'css': path.join(publicdir, '*/css/**/*.css'),
    'js': path.join(publicdir, '*/js/**/*.js'),
    'routes': path.join(basedir, '/routes/**/*.js')
};

/*
 * 用来拷贝和压缩views下html的任务  start
 */
gulp.task('views', function() {
    return gulp.src(['./views/**/*.html'])
        // 最小化html
         .pipe(htmlmin({
             collapseWhitespace:true,
             collapseBooleanAttributes:true,
             removeAttributeQuotes:true,
             removeComments:true,
             removeEmptyAttributes:true,
             removeScriptTypeAttributes:true,
             removeStyleLinkTypeAttributes:true
         }))
        // 指定生成到哪个目录下去
        .pipe(gulp.dest('./dist/views/'))
        .pipe(bs.reload({stream:true}))
});
/*
 * 用来拷贝和压缩views下html的任务  end
 */

/*
 * public的下的css同步拷贝  end
 */
gulp.task('styles', function() {
    return gulp.src('./public/css/**/*.css')
        //加上兼容性前缀
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        //压缩css
        .pipe(cssnano())
        // 最小化CSS代码
        .pipe(minifycss())
        // 指定生成到哪个目录下去
        .pipe(gulp.dest('./dist/public/css'))
        .pipe(bs.reload({stream:true}))
});
/*
 * public的下的css同步拷贝  end
 */

/*
 * 图片同步拷贝和压缩  start
 */
gulp.task('images', function() {
  return gulp.src('./public/images/**/*')
      .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngcrush()]
      }))
    .pipe(gulp.dest('./dist/public/images'))
});
/*
 * 图片同步拷贝和压缩  end
 */

/*
 * 同步拷贝public下的js文件到dist目录的public下   start
 */
gulp.task('scripts', function() {
    return gulp.src('./public/js/**/*.js')
        // 对报错的js代码进行错误提示
        .pipe(plumber())
        // JS文件合并，这里不需要直接先注释,根据实际需求来就行了
        //.pipe(concat('all.js'))
        // JS代码压缩  如果我们写的js是语法错误之类的
        .pipe(uglify())
        // 指定生成到哪个目录下去
        .pipe(gulp.dest('./dist/public/js'))
        .pipe(bs.reload({stream:true}))
});
/*
 * 同步拷贝public下的js文件到dist目录的public下  end
 */

/*
 * 同步拷贝public下的js文件下插件样式及图片到dist目录的public下   start
 */
gulp.task('lib', function() {
    return gulp.src(['./public/js/**/*.css','./public/js/**/*.png','./public/js/**/*.jpg'])
        // 指定生成到哪个目录下去
        .pipe(gulp.dest('./dist/public/js'))
        .pipe(bs.reload({stream:true}))
});
/*
 * 同步拷贝public下的js文件下插件样式及图片到dist目录的public下  end
 */

/*
 * router的同步拷贝和压缩  start
 */
gulp.task('routes', function() {
    return gulp.src('./routes/**/*.js')
        // 对报错的js代码进行错误提示
        .pipe(plumber())
        // JS文件合并，这里不需要直接先注释,根据实际需求来就行了
        //.pipe(concat('all.js'))
        // JS代码压缩
        .pipe(uglify())
        // 指定生成到哪个目录下去
        .pipe(gulp.dest('./dist/routes/'))
        .pipe(bs.reload({stream:true}))
});
/*
 * router的同步拷贝和压缩  end
 */

/*
 * 重要配置文件的拷贝  start
 */
gulp.task('configFile', function() {
    return gulp.src(['./*.js', '!./gulpfile.js'])
        // 对报错的js代码进行错误提示
        .pipe(plumber())
        // JS文件合并，这里不需要直接先注释,根据实际需求来就行了
        //.pipe(concat('all.js'))
        // JS代码压缩
        .pipe(uglify())
        // 指定生成到哪个目录下去
        .pipe(gulp.dest('./dist/'))
        .pipe(bs.reload({stream:true}))
});
/*
 * 重要配置文件的拷贝  start
 */

/*
 * 同步和拷贝bin目录过去  start
 */
gulp.task('bin', function() {
    return gulp.src('./bin/*')
    .pipe(gulp.dest('./dist/bin/'))
});
/*
 * 同步和拷贝bin目录过去  end
 */
//字体文件
// gulp.task("font",function(){
// 	return gulp.src(['./sass/*/stylesheets/**/*.eot','./sass/*/stylesheets/**/*.svg','./sass/*/stylesheets/**/*.ttf','./sass/*/stylesheets/**/*.woff'])
// 	.pipe(gulp.dest('./dist/public/'))
// 	.pipe(gulp.dest('./public/'))
// 	.pipe(bs.stream());
// })
/*
 * gulp监听文件变化  start
 */
gulp.task('watch',['views','styles','images','scripts','lib','routes'],function() {
     //watch监听文件变化
    gulp.watch(['./views/**/*.html','./public/*/css/**/*.css','./public/*/images/*.*','./public/*/js/**/*.js','./routes/**/*.js','./bin/*'])
    .on('change', function(event) {
        bs.reload;
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
/*
 * gulp监听文件变化  end
 */

/*
 * 启动express，并添加browserSync支持  start
 */
gulp.task('server',function() {
    bs.init(null, {
        //      proxy:'http://localhost:' + config.port,
        files: [filepath.views, filepath.css, filepath.js,filepath.routes],
        notify: false,
        browser: 'chrome',
        open: true,
        port: 8888
    });
});
/*
 * 启动express，并添加browserSync支持  end
 */
/*
 * 通过gulp一下自动执行默认的任务  start 
 */
gulp.task('default', ['views','styles','images','scripts','lib','routes','configFile','bin','watch'],function(cb){
	//开启nodemon自动重启服务
	  var started = false;
	  return nodemon({
	    script: './bin/www'
	  }).on('start', function() {
	    if (!started) {
	      cb();
	      started = true;
	    }
	  });
});
/*
 * 通过gulp一下自动执行默认的任务  end
 */
