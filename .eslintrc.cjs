/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	extends: [
		'./.eslintrc-auto-import.json',
		'plugin:vue/vue3-recommended',
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
		'@vue/typescript/recommended',
		'plugin:storybook/recommended',
		'prettier',
	],
	plugins: ['eslint-plugin-prettier'],
	rules: {
		'vue/require-default-prop': 'off',
		'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'error',
		'no-debugger': process.env.NODE_ENV === 'development' ? 'off' : 'error',
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		'vue/multi-word-component-names': 'off',
		'no-unused-vars': 'off',
		'sort-imports': 'off',
	},
	overrides: [
		{
			files: '*.mdx',
			extends: 'plugin:mdx/recommended',
		},
	],
}
