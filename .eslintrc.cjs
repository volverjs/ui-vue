/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	extends: [
		'plugin:vue/vue3-recommended',
		'eslint:recommended',
		'@vue/eslint-config-typescript/recommended',
		'@vue/eslint-config-prettier',
		'prettier',
		'plugin:storybook/recommended',
		// "parser": "eslint-mdx", // enable `eslint-mdx` manually if it does not work
		'plugin:mdx/recommended'
	],
	rules: {
		'vue/require-default-prop': 'off',
		'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'error',
		'no-debugger': process.env.NODE_ENV === 'development' ? 'off' : 'error',
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		'vue/multi-word-component-names': 'off',
		'no-unused-vars': 'off',
		'sort-imports': 'off'
	}
}
