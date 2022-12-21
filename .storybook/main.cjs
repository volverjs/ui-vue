const path = require('path')
module.exports = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-a11y',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-docs',
		'storybook-dark-mode'
	],
	framework: {
		name: '@storybook/vue3-vite',
		options: {}
	},
	staticDirs: ['./static'],
	docs: {
		docsPage: true
	},
	async viteFinal(config, { configType }) {
		if (configType === 'PRODUCTION') {
			config.base = '/ui-vue/'
		}
		// config.base = '/storybook/'
		config.resolve.alias = {
			...config.resolve.alias,
			'@': path.resolve(__dirname, '../src')
		}
		return config
	}
}
