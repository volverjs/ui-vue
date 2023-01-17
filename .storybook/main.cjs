const path = require('path')
module.exports = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-a11y',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'storybook-dark-mode',
	],
	framework: {
		name: '@storybook/vue3-vite',
	},
	staticDirs: ['./static'],
	docs: {
		disable: true,
	},
	features: {
		interactionsDebugger: true,
	},
}
