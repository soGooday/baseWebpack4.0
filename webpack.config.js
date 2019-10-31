const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') 
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') 
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports={
    entry:'./src/index.js',
    output:{
        filename:'index.js',
        path:path.resolve(__dirname,'dist')
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'./src/index.html'
        }), 
        new CleanWebpackPlugin(), 
        // new MiniCssExtractPlugin({
        //     filename: "css/index.css",
        // }),
        // new ExtractTextPlugin('css/index.css'),
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin([
            {
              from: './src/assets/images',
              to: './assets/images',
              ignore: ['.*']
            }
        ]),
        new webpack.ProvidePlugin({
            $: 'zepto-webpack'
        })
  
    ],
    module:{
        rules: [ // 用于规定在不同模块被创建时如何处理模块的规则数组
            {
                test: '/\.js$/',
                exclude: '/(node_modules)/', // 排除文件
                loader: 'babel-loader'
              }
        ,
            {
                // test: /\.css$/,
                // use:ExtractTextPlugin.extract({
                //     fallback:"style-loader",
                //     use:"css-loader"
                // })
                test: /\.css/,
                include: [
                  path.resolve(__dirname, 'src'),
                ],
                use: [
                  MiniCssExtractPlugin.loader,
                  // 'style-loader',
                  'css-loader',
                ], 
               
            },
            {
                test: /\.scss$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  // 'style-loader',
                  'css-loader',
                  "sass-loader"
                  // {
                  //   loader: "style-loader" // 将 JS 字符串生成为 style 节点
                  // },
                  // {
                  //   loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                  // },
                  // {
                  //   loader: "sass-loader" // 将 Sass 编译成 CSS
                  // }
                ]
              } 
        ] 
    },
    devServer: {
        //设置基本结构
        // contentBase: path.resolve(__dirname, './dist'),
        contentBase: path.resolve(__dirname, './src/'),//这个很关键他是决定打开文件之后从那个页面座位主页面
        host: 'localhost',//服务器IP地址,可以是localhost
        compress: true,//服务端压缩是否开启
        open: true,// 自动打开浏览器
        hot: true ,// 开启热更新 
      } 
}

 
 
 
 