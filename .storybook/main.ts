import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
		'storybook-dark-mode',
	],
	framework: {
		name: '@storybook/vue3-vite',
		options: {},
	},
	staticDirs: ['./static'],
	docs: {
		autodocs: 'tag',
	},
}

export default config
