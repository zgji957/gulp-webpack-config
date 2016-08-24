var gulp =  require('gulp');
/*
 * 加载依赖模块
 * ****************************************************
 */
// 获取uplify 模块（用于压缩JS）
var uglify = require('gulp-uglify');
// 获取 minify-css 模块（用于压缩 CSS）
var minifyCSS = require('gulp-minify-css');
// 获取 gulp-imagemin 模块
var imagemin = require('gulp-imagemin');
// 获取 gulp-sass 模块
var sass = require('gulp-sass');
// 获取 gulp-concat 模块
var concat=require('gulp-concat');
// 获取 gulp-rename 模块
var rename = require("gulp-rename");
// 获取 gulp-base64 模块
var base64 = require("gulp-base64");
// 获取 gulp-rev 模块
var rev=require('gulp-rev');
// 获取 gulp-rev-collector 模块
var revCollector=require('gulp-rev-collector');
// 获取 gulp-clean 模块
var revClean=require('gulp-clean');
// 获取 runSequence 模块
var runSequence = require('run-sequence');
// 获取 gulp-replace 模块
var replace = require('gulp-replace');
// 获取 webpack 模块
var webpack = require('webpack');
// 获取 webpack 配置文件
var webpackConfig = require("./webpack.config.js");

/*
 * 加载任务模块
 * ****************************************************
 */

// 压缩图片任务
gulp.task('images', function () {
    // 1. 找到图片
    gulp.src('./static/images/**/*.*')
        // 2. 压缩图片
        .pipe(imagemin({
            progressive: true
        }))
        // 3. 另存图片
        .pipe(gulp.dest('./dist/images'))
});

// 编译sass&&压缩css
gulp.task('sass', function () {
    gulp.src('./static/sass/**/*.scss') //该任务针对的文件
        .pipe(sass()) //该任务调用的模块
        .pipe(minifyCSS())
        //.pipe(rename(function(path){
        //    path.basename+=".min";
        //    path.extname=".css"
        //}))
        .pipe(gulp.dest('./dist/css'));
});

//css文件添加md5
gulp.task('cssRev', function () {
    return gulp.src('./dist/css/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./dist/css'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( './rev/css' ) );
});

//js文件添加md5
gulp.task('jsRev', function () {
    return gulp.src('./dist/js/*.js')
        .pipe(rev())
        .pipe(gulp.dest('./dist/js'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( './rev/js' ) );
});

// 压缩 js 文件
gulp.task('unlifyJs', function() {
    // 1. 找到文件
    gulp.src('./dist/js/*.js')
        // 2. 压缩文件
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' //保留所有注释
        }))
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('./dist/js'));
});

//文件加md5
gulp.task('rev',function(){
    return gulp.src(['rev/**/*.json', 'views/*.html'])
        .pipe(revCollector({
            replaceReved:true
        }))
        .pipe( gulp.dest('./views') );
});

//清理文件
gulp.task('clean',function(){
    return gulp.src(['./rev','./dist/js/*.js','./dist/css/*.css'],{read:false})
        .pipe(revClean());
});

// 图片base64任务
gulp.task('base64',function(){
    return gulp.src('./dist/css/**/*.css')
        .pipe(base64({
            //baseDir: build,
            extensions: ['jpg','png'],
            maxImageSize: 20 * 1024, // bytes
            debug: false
        }))
        .pipe(gulp.dest("./dist/css/"));
});

// webpack任务
gulp.task("webpack", function(callback) {
    var myConfig = Object.create(webpackConfig);
    // run webpack
    webpack(
        myConfig
        , function(err, stats) {
            callback();
        });
});

// 自动生成版本号任务
gulp.task('autoMD5',function(done){
    runSequence(
        ['clean'],
        ['webpack','sass'],
        ['cssRev','jsRev'],
        ['rev'],
        done);
});

// 监听，在命令行使用 gulp auto 启动此任务
gulp.task('auto', function() {
    gulp.watch('./static/js/**/*.js', ['webpack']);
    //gulp.watch('./static/css/**/*.css',['webpack']);
    gulp.watch('./static/sass/**/*.scss', ['sass']);
});


// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 script 任务和 auto 任务
gulp.task('default', ['webpack','sass','auto']);


/*
 * 加载XX模块
 * ****************************************************
 */
