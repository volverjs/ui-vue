const path = require('path')

module.exports = {
	stories: [
		'../src/stories/volver-ui-vue.stories.mdx',
		'../src/stories/**/*.stories.mdx',
		'../src/stories/**/*.stories.@(js|jsx|ts|tsx)'
	],
	addons: [
		'@storybook/addon-a11y',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-docs',
		'storybook-dark-mode'
	],
	staticDirs: ['./static'],
	framework: '@storybook/vue3-vite',
	core: {
		builder: '@storybook/builder-vite'
	},
	features: {
		// storyStoreV7: true,
		// previewMdx2: true // 👈 MDX 2 enabled here
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
	},
	docsPage: {
		docs: 'automatic'
	}
}
