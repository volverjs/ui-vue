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
		'plugin:storybook/recommended'
	],
	rules: {
		'vue/require-default-prop': 'off'
	}
}
