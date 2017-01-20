var gulp = require('gulp');
/*
 * 加载依赖模块
 * ****************************************************
 */
// 获取uplify 模块（用于压缩JS）
var uglify = require('gulp-uglify');
// 获取 minify-css 模块（用于压缩 CSS）
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var base64 = require("gulp-base64");
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var revClean = require('gulp-clean');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var minifyHtml = require('gulp-minify-html');
var gulpif = require('gulp-if');
var webpack = require('webpack');
var cdnizer = require("gulp-cdnizer");
var replace = require('gulp-url-replace');
// 获取 webpack 配置文件
var webpackConfig = require("./webpack.config.js");

var condition = false; //false为开发环境，true为生产环境

/*
 * 加载任务模块
 * ****************************************************
 */

// 压缩图片任务
gulp.task('images', function() {
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
gulp.task('sass', function() {
    gulp.src('./static/sass/**/*.scss') //该任务针对的文件
        .pipe(sass()) //该任务调用的模块
        .pipe(minifyCSS())
        .pipe(gulp.dest('./dist/css'));
});

//css文件添加md5
gulp.task('cssRev', function() {
    return gulp.src('./dist/css/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/css'));
});

//js文件添加md5
gulp.task('jsRev', function() {
    return gulp.src('./dist/js/*.js')
        .pipe(rev())
        .pipe(gulp.dest('./dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'));
});

// 压缩 js 文件
gulp.task('unlifyJs', function() {
    // 1. 找到文件
    gulp.src('./dist/js/*.js')
        // 2. 压缩文件
        .pipe(uglify({
            mangle: true, //类型：Boolean 默认：true 是否修改变量名
            compress: true, //类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' //保留所有注释
        }))
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('./dist/js'));
});

//文件加md5
gulp.task('rev', function() {
    return gulp.src(['rev/**/*.json', 'views/**/*.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulpif(
            false, minifyHtml({
                empty: false,
                spare: false,
                quotes: false
            })
        ))
        .pipe(gulp.dest('./views'));
});

//清理文件
gulp.task('clean', function() {
    return gulp.src(['./rev', './dist/js/*.js', './dist/css/*.css'], { read: false })
        .pipe(revClean());
});

// 图片base64任务
gulp.task('base64', function() {
    return gulp.src('./dist/css/**/*.css')
        .pipe(base64({
            //baseDir: build,
            extensions: ['jpg', 'png'],
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
        myConfig,
        function(err, stats) {
            callback();
        });
});

//替换rev内容
gulp.task('replaceRev', function() {
    gulp.src('./rev/**/*.json')
        // .pipe(replace(/( ?v=[^ "]*")/g, '"'))
        .pipe(replace(/-([a-zA-Z0-9])*/g, ''))
        .pipe(gulp.dest('./rev/'));
});

//CDN
gulp.task('htmlCDN', function() {
    var cdn = "http://teenagertestcdn.speakhi.com/front";
    var version = "/1.4.5";
    if (!condition) {
        cdn = "";
        version = "";
    }
    return gulp.src('./views/**/*.html')
        .pipe(cdnizer({
            defaultCDNBase: cdn,
            // allowRev: true,
            // allowMin: true,
            files: [{
                    file: '**/dist/js/**/*.js',
                    cdn: cdn + "/web/dist/js" + version + "/${ filename }"
                },
                {
                    file: '**/dist/css/**/*.css',
                    cdn: cdn + "/web/dist/css" + version + "/${ filename }"
                },
                {
                    file: '/web/static/images/**/*.{gif,png,jpg,jpeg}',
                    // cdn: "http://teenagertestcdn.speakhi.com/front/web/dist/css/1.4.2/${ filename }"
                }
            ]
        }))
        .pipe(gulp.dest('./views/'));
});

gulp.task('cssCDN', function() {
    return gulp.src('./dist/css/**/*.css')
        // return gulp.src('test.scss')
        .pipe(cdnizer({
            allowRev: true,
            allowMin: true,
            defaultCDNBase: "http://teenagertestcdn.speakhi.com/front/",
            // relativeRoot: 'css',
            files: [{
                file: '**/web/static/images/**/*.{gif,png,jpg,jpeg}'
                    // cdn: 'http://teenagertestcdn.speakhi.com/front/static/images/${ version }/${ filename }'
            }, {
                file: '**/web/static/fonts/sh-fonts.eot?bn7vxo'
            }, {
                file: '**/web/static/fonts/sh-fonts.eot'
            }, {
                file: '**/web/static/fonts/sh-fonts.ttf?bn7vxo'
            }, {
                file: '**/web/static/fonts/sh-fonts.ttf'
            }, {
                file: '**/web/static/fonts/sh-fonts.woff?bn7vxo'
            }, {
                file: '**/web/static/fonts/sh-fonts.woff'
            }, {
                file: '**/web/static/fonts/sh-fonts.svg?bn7vxo#icomoon'
            }, {
                file: '**/web/static/fonts/sh-fonts.svg'
            }, {
                file: '**/web/static/fonts/iconfont.woff'
            }, {
                file: '**/web/static/fonts/iconfont.ttf'
            }, {
                file: '**/web/static/fonts/iconfont.eot'
            }, {
                file: '**/web/static/fonts/iconfont.svg'
            }]
        }))
        .pipe(gulp.dest('./dist/css/'));
    // .pipe(gulp.dest('./'));
});

//自动检测文件变化
gulp.task('auto', function() {
    condition = false;
    gulp.watch('./static/js/**/*.js', ['webpack']);
    //gulp.watch('./static/css/**/*.css',['webpack']);
    gulp.watch('./static/sass/**/*.scss', ['sass']);
});

// 正式环境
gulp.task('build', function(done) {
    condition = true;
    runSequence(
        // ['clean'], ['webpack', 'sass'], ['cssRev', 'jsRev'], ['rev'], ['htmlCDN', 'cssCDN'],
        ['clean'], ['webpack', 'sass'], ['cssCDN'], ['htmlCDN'],
        done);
});

// 开发环境
gulp.task('develop', function(done) {
    runSequence(
        ['auto'],
        done);
});

// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 script 任务和 auto 任务
gulp.task('default', ['webpack', 'sass', 'auto']);


/*
 * 加载XX模块
 * ****************************************************
 */