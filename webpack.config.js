var path = require('path');
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');


module.exports = {
    watchOptions: { poll: true},
    //插件项
    plugins: [
        commonsPlugin,
        new webpack.optimize.UglifyJsPlugin({    //压缩代码
            mangle:false
        })
    ],
    //页面入口文件配置
    entry: {
        index : ['./static/js/index.js'],
        teacher : ['./static/js/teacher.js'],
        singlePage:['./static/js/singlePage.js']
    },
    //入口文件输出配置
    output: {
        path: './dist/js',
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.js$/, loader: "jsx-loader?harmony"},
			{ test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
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
        extensions: ['', '.js', '.json', '.scss','.css'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            jquery:'libs/jquery/jquery-1.11.2.js',
            angular:'libs/angular/angular.js',
			route:'libs/angular/angular-ui-router.js',
            angularAnimate:'libs/angular/angular-animate.js',
            animateCss:'libs/animate/animate.min.css',
            wow:'libs/wow/wow.js',
            scrollreveal:'libs/scrollreveal/scrollreveal.js',
            slick:"libs/slick/slick.min.js",
            layer:"libs/layer/layer.js",
            jqueryCookies:"libs/cookies/jquery.cookie.js",
            placeholder:"libs/placeholder/placeholders.js",
            lazyload:"libs/lazyload/jquery.lazyload.js",
			ErrorCode:'js/utils/ErrorCode.js',
            WebProperty:'js/utils/WebProperty.js',
            Link: 'js/utils/Link.js'
		}
    }
};