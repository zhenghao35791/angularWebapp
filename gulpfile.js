var gulp = require('gulp');
var $ = require('gulp-load-plugins')();//在方法后加上双括号，表示立即调用
//引入plugin插件后，可以用$直接调用以gulp开头的插件，而不再需要require声明
var open = require('open');
var app = {
  srcPath: 'src/',   //源代码路径
  devPath: 'build/', //整合后的路径，开发路径
  prdPath: 'dist/'   //生产环境路径
};
gulp.task('lib', function(){
  gulp.src('bower_components/**/*')
    .pipe(gulp.dest(app.devPath + 'vender'))
    .pipe(gulp.dest(app.prdPath + 'vender'))
    .pipe($.connect.reload());
});

gulp.task('html', function(){
  gulp.src(app.srcPath + '/**/*.html')
    .pipe(gulp.dest(app.devPath))
    .pipe(gulp.dest(app.prdPath))
    .pipe($.connect.reload());
});

gulp.task('json', function(){
  gulp.src(app.srcPath + 'data/**/*.json')
    .pipe(gulp.dest(app.devPath + 'data'))
    .pipe(gulp.dest(app.prdPath + 'data'))
    .pipe($.connect.reload());
});

gulp.task('less', function(){
  gulp.src(app.srcPath + 'style/index.less')
    .pipe($.plumber())
    .pipe($.less())//因为有gulp-load-plugins插件，可以直接用$.less调用gulp-less插件
    .pipe(gulp.dest(app.devPath + 'css'))
    .pipe($.cssmin())//因为有gulp-load-plugins插件，可以直接用$.less调用gulp-cssmin插件
    .pipe(gulp.dest(app.prdPath + 'css'))//传入到线上路径之前先压缩css
    .pipe($.connect.reload());
});

gulp.task('js', function(){
  gulp.src(app.srcPath + 'script/**/*.js')
    .pipe($.plumber())
    .pipe($.concat('index.js'))//通过gulp-concat插件将所有js文件合并成一个index.js
    .pipe(gulp.dest(app.devPath + 'js'))
    .pipe($.uglify())//流入线上环境路径之前，压缩js代码
    .pipe(gulp.dest(app.prdPath + 'js'))
    .pipe($.connect.reload());
});

gulp.task('image', function(){
  gulp.src(app.srcPath + 'image/**/*')
    .pipe(gulp.dest(app.devPath + 'image'))
    .pipe($.imagemin())//流入线上环境路径之前，压缩image图片
    .pipe(gulp.dest(app.prdPath + 'image'))
    .pipe($.connect.reload());//通过reload来实现刷新，ie8以下不支持
});

gulp.task('build',['image','js','less','json','lib','html']);

gulp.task('clean', function(){
  gulp.src([app.devPath, app.prdPath])  //同时清除编码环境和线上环境的目录内容
    .pipe($.clean());
});

gulp.task('serve', ['build'], function() {//serve任务中引入build任务
  $.connect.server({  //启动一个服务器
    root: [app.devPath], //服务器从哪个路径开始读取，默认从开发路径读取
    livereload: true, //每当写完之后自动刷新浏览器，只支持高版本浏览器
    port: 3000 //服务器端口号
  });

  open('http://localhost:3000'); //服务起来后，自动打开页面

  //watch作用，当监控的内容发生变化，修改原文件的时候，自动执行构建任务
  gulp.watch('bower_components/**/*', ['lib']);
  gulp.watch(app.srcPath + '**/*.html', ['html']);
  gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
  gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
  gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
  gulp.watch(app.srcPath + 'image/**/*', ['image']);
});
  //为实现构建完成后，刷新浏览器，进行实时预览，
  // 需要在每个任务最后添加.pipe($.connect.reload());
gulp.task('default', ['serve']);//控制台使用gulp命令，就会调用default任务，
//这里设定的default任务是serve，即gulp等同于gulp serve。
