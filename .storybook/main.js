const path = require('path')
const { mergeConfig } = require('vite')
// const vuePlugin = require('@vitejs/plugin-vue')

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
		// return the customized config
		return mergeConfig(config, {
			// plugins: [vuePlugin()],
			// customize the Vite config here
			resolve: {
				alias: {
					'@': path.resolve(__dirname, './src')
				}
			}
		})
	}
}
