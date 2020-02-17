const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') 
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') 
// const CopyWebpackPlugin = require('copy-webpack-plugin') 
// const vConsolePlugin = require('vconsole-webpack-plugin');
const envTypeDist = process.env.NODE_ENV === 'development' ? 'dist.test/dist' : 'dist.prod/dist';//打包地址的设置
const envType = process.env.NODE_ENV === 'development' ? 'development' : 'production';//设置当前的环境
console.log('我们当前的环境是：',envType);
module.exports={
    entry:'./src/index.js',
    output:{
        filename:'index.js',
        path:path.resolve(__dirname,envTypeDist)
    },
    // mode:envType,
    // mode:'development',
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
        new MiniCssExtractPlugin({
          filename:'index.css'
        }),
        // new CopyWebpackPlugin([
        //     {
        //       from: './src/assets/images',
        //       to: './assets/images',
        //       ignore: ['.*']
        //     }
        // ]),
        new webpack.ProvidePlugin({
            $: 'zepto-webpack'
        }),
      //   new vConsolePlugin({
      //     filter: [],  // 需要过滤的入口文件
      //     enable: true // 发布代码前记得改回 false
      // }),
  
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
                test: /\.css/,
                include: [
                  path.resolve(__dirname, 'src'),
                ],
                use: [
                  MiniCssExtractPlugin.loader, 
                  'css-loader',
                ], 
               
            },
            {
                test: /\.scss$/,
                use: [
                  MiniCssExtractPlugin.loader, 
              
                  'css-loader', 
                  // {
                  //   loader: 'px2rem-loader',
                  //   options:{
                  //     remUnit: 75,
                  //     remPrecesion:8
                  //   }
                  // },
                  {
                    loader:'postcss-loader',
                    options:{
                      plugins: () => [
                        require('autoprefixer')({
                          overrideBrowserslist:['last 2 version', '>1%'  ]
                        })
                      ]
                    }
                  },
                  "sass-loader",  
                ]
              },
              {
                test: /\.(png|jpg|gif)$/,
                use: [
                  {
                    loader: 'url-loader?limit=10&name=assets/images/[name].[ext]',  
                  }
                ]
              }
        ] 
    },
    devServer: {
        //设置基本结构
        // contentBase: path.resolve(__dirname, './dist'),
        contentBase: path.resolve(__dirname, './src/'),//这个很关键他是决定打开文件之后从那个页面座位主页面
        host: 'localhost',//服务器IP地址,可以是localhost 
        open: true,// 自动打开浏览器
        hot: true ,// 开启热更新 
      } 
}

 
 
 
 