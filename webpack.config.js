const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
require('dotenv').config();

module.exports = {
	entry: './src/index.js',
	mode: process.env.ENV,
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	stats: {
		warnings: false
	},
	target: 'node',
	module: {
		rules: [
			{
				use: 'babel-loader',
				exclude: /(node_modules)/,
				test: /\.js$/
			}
		]
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					keep_classnames: true,
				},
			}),
		],
	}
};