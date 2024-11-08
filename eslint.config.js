import antfu from '@antfu/eslint-config'

export default antfu({
    type: 'lib',
    typescript: {
        overrides: {
            'ts/explicit-function-return-type': 'off',
            'ts/consistent-type-definitions': 'off',
        },
    },
    vue: true,
    node: true,
    yaml: false,
    stylistic: {
        indent: 4,
        quotes: 'single',
        semi: false,
    },
    rules: {
        'style/no-tabs': 'off',
        'style/no-mixed-spaces-and-tabs': 'off',
    },
    extends: [
        'src/.eslintrc-auto-import.json',
    ],
    ignores: [
        '**/icons/**',
    ],
}, {
    ignores: ['dist', 'bin', 'node_modules', 'storybook-static', 'vendor', 'scripts', 'package.json', 'pnpm-lock.yaml'],
})
