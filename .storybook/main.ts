import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
		'storybook-dark-mode',
		'storybook-version',
	],
	framework: {
		name: '@storybook/vue3-vite',
		options: {},
	},
	staticDirs: ['./static'],
	docs: {
		autodocs: false,
	},
}

export default config
