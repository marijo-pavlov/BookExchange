module.exports = {
	entry: './src/app.js',
	output: {
		filename: './public/javascripts/bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel',
				query: {
					presets: ['react', 'es2015']
				},
				include: /src/
			}
		]
	}
}
