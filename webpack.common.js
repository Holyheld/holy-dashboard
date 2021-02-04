const path = require('path');
const glob = require('glob');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const SpritePlugin = require('svg-sprite-loader/plugin');
const Dotenv = require('dotenv-webpack');

const pages = [];

const optionsDataItems = glob
	.sync(`src/data/options/*.json`)
	.map(pathStr => ({
		...require('./' + pathStr),
		pageName: path.basename(pathStr, path.extname(pathStr))
	}))
	.filter(item => item.pageName !== 'index')
	.sort((a, b) => a.body.order - b.body.order);

const optionsGeneralData = require('./src/data/options/index.json');

const optionsPages = glob.sync('src/pages/options/*.pug');
optionsPages.forEach(template => {
	optionsDataItems.forEach(data => {
		if (data.body.disabled) return;
		pages.push({
			filename: `${data.pageName}/index.html`,
			template,
			data: {
				...data,
				...optionsGeneralData,
				pageName: data.pageName
			}
		});
	});
});

const rootPages = glob.sync('src/pages/*.pug');
rootPages.forEach(template => {
	const name = path.basename(template, path.extname(template));
	const data = require(`./src/data/${name}.json`);

	pages.push({
		filename: `${name === 'index' ? '' : `${name}/`}index.html`,
		template,
		data: {
			...data,
			body: {
				...data.body,
				...(name === 'index'
					? {
							options: {
								...data.body.options,
								items: optionsDataItems
							}
					  }
					: {})
			}
		}
	});
});

module.exports = {
	mode: 'development',
	entry: {
		main: './src/scripts/index.js'
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				loader: 'pug-loader',
				options: {
					pretty: true
				}
			},
			{
				test: /\.txt$/,
				use: 'raw-loader'
			},
			{
				test: /\.(woff|woff2|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/fonts/',
							publicPath: '/assets/fonts/'
						}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: [/node_modules\/(?!(swiper|dom7|bunnyjs)\/).*/],
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: 'svg-sprite-loader',
						options: {
							extract: true,
							spriteFilename: `assets/svg/icons.svg`
						}
					},
					'svgo-loader'
				]
			}
		]
	},
	plugins: [
		new Dotenv({
			path: `.env`
		}),
		new CleanWebpackPlugin(),
		new WriteFilePlugin(),
		new CopyPlugin([
			...[
				{
					from: path.resolve(__dirname, 'src/images'),
					to: path.resolve(__dirname, 'dist/assets/images')
				},
				{
					from: path.resolve(__dirname, 'public'),
					to: path.resolve(__dirname, 'dist')
				}
			]
		]),
		...pages.map(page => {
			return new HtmlWebpackPlugin({
				filename: page.filename,
				template: page.template,
				data: page.data,
				generalData: require(`./src/data/general.json`),
				inject: 'body',
				minify: {
					collapseWhitespace: true,
					preserveLineBreaks: false
				},
				pages
			});
		}),
		new PreloadWebpackPlugin({
			rel: 'preload',
			as(entry) {
				if (/\.(woff2)$/.test(entry)) return 'font';
				if (/\.(css)$/.test(entry)) return 'style';
			},
			fileWhitelist: [/\.(woff2|css)$/],
			include: 'allAssets'
		}),
		new SpritePlugin({
			plainSprite: true,
			spriteAttrs: {
				style: 'width:0; height:0; visibility:hidden; display: none;'
			}
		})
	]
};
