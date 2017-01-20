var path = require('path');
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');


module.exports = {
    watchOptions: { poll: true },
    //插件项
    plugins: [
        commonsPlugin,
        // new webpack.optimize.UglifyJsPlugin({ //压缩代码
        //     mangle: false
        // })
    ],
    //页面入口文件配置
    entry: {
        main: ['./static/js/main.js'],
        teacher: ['./static/js/teacher.js'],
        updateBrower: ['./static/js/common/updateBrower.js']
    },
    //入口文件输出配置
    output: {
        path: './dist/js',
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.js$/, loader: "jsx-loader?harmony" },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap' },
            //{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
            //{ test: require.resolve('./static/libs/jquery/jquery-1.11.2.js'), loader: 'expose?jQuery'}
            //{ test: require.resolve('./static/libs/angular/angular.min.js'), loader: 'expose?jQuery'}
        ]
    },
    //其它解决方案配置
    resolve: {
        //查找module的话从这里开始查找
        root: [
            path.join(__dirname, "/static")
        ],
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', '.json', '.scss', '.css'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            updateBrower: 'js/common/updateBrower.js',
            jquery: 'libs/jquery/jquery-1.11.2.js',
            angular: 'libs/angular/angular.js',
            route: 'libs/angular/angular-ui-router.js',
            angularAnimate: 'libs/angular/angular-animate.js',
            animateCss: 'libs/animate/animate.min.css',
            slick: "libs/slick/slick.min.js",
            layer: "libs/layer/layer.js",
            placeholder: "libs/placeholder/placeholders.js",
            lazyload: "libs/lazyload/jquery.lazyload.js",
            transit: "libs/transit/jquery.transit.js",
            moment: "libs/moment/moment-with-locales.js",
            ErrorCode: 'js/utils/ErrorCode.js',
            Link: 'js/utils/Link.js',
            echarts: 'libs/echarts/echarts.min.js',
            store: 'libs/store/store.min.js',
            cookies: 'libs/cookies/js.cookie.js',
            spin: 'libs/spin/spin.js',
            webuploader: 'libs/webuploader/webuploader.min.js',
            scrollreveal: 'libs/scrollreveal/scrollreveal.js',
            cropper: 'libs/webuploader/cropper.js',
            ConstConfig: 'js/utils/ConstConfig.js',
            perfectScrollbar: "libs/perfectScrollbar/js/perfect-scrollbar.jquery.min.js",
            scrollreveal: "libs/scrollreveal/scrollreveal.min.js"
        }
    }
};