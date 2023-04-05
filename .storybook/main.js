export default {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-a11y',
		'@storybook/addon-links',
		{
			name: '@storybook/addon-essentials',
			// options: {
			// 	docs: false,
			// },
		},
		'@storybook/addon-interactions',
		'storybook-dark-mode',
		'storybook-version',
	],
	framework: {
		name: '@storybook/vue3-vite',
	},
	staticDirs: ['./static'],
	docs: {
		// autodocs: false,
	},
	features: {
		storyStoreV7: false,
		interactionsDebugger: true,
		buildStoriesJson: true,
	},
}
