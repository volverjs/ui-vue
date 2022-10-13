module.exports = {
	stories: [
		'../src/**/*.stories.mdx',
		'../src/**/*.stories.@(js|jsx|ts|tsx)'
	],
	addons: [
		'@storybook/addon-a11y',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-docs'
	],
	framework: '@storybook/vue3',
	core: {
		builder: '@storybook/builder-vite'
	},
	features: {
		storyStoreV7: true
	},
	async viteFinal(config) {
		config.base = '/storybook/'

		config.resolve.alias = {
			...config.resolve.alias,
			'@': '../src'
		}

		return config
	}
}
