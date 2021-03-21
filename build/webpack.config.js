const { VueLoaderPlugin } = require('vue-loader')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV


const HOST = 'localhost'
const PORT = 8081

module.exports = {
	mode: NODE_ENV,
  entry: {
    main: process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '../example/index.js') : path.resolve(__dirname, '../src/index.js'),
	},
	output: {
    path: path.resolve(__dirname, '../package'),
    filename: 'vue-luck-draw.js', //打包之后生成的文件名，可以随意写。
    library: 'vue-luck-draw', // 指定类库名,主要用于直接引用的方式(比如使用script 标签)
    libraryExport: "default", // 对外暴露default属性，就可以直接调用default里的属性
    globalObject: 'this', // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
    libraryTarget: 'umd' // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
	},
	module: {
    rules: [
      { test: /\.vue$/,
				use: 'vue-loader'
			},
			{
				test:	/\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			}
    ],
	},
	devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: 'dist',
    compress: true,
    host: HOST,
    port: PORT,
    open: true,
    overlay: { warnings: false, errors: true },
		publicPath: '/',
		contentBase: path.join(__dirname, 'dist'),
    quiet: true
  },
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
      template: './example/index.html',
      filename: 'index.html',
      inject: true
    }),
  ]
}