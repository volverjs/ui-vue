import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

    addons: [
        '@storybook/addon-docs',
        '@storybook/addon-links',
        '@storybook/addon-a11y',
        '@vueless/storybook-dark-mode',
        '@storybook/addon-themes',
        '@storybook/addon-vitest',
    ],

    framework: {
        name: '@storybook/vue3-vite',
        options: {
            docgen: {
                plugin: 'vue-component-meta',
                tsconfig: 'tsconfig.json',
            },
        },
    },

    staticDirs: ['./static'],
}

export default config
